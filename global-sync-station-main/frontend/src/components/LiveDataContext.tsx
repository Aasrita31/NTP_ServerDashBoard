import React from 'react';
import type { CountryCardProps } from './CountryCard';

type LiveUtc = {
  iso: string;
  epoch_ms: number;
  stratum?: number;
  refid?: string;
  leap?: string;
  office?: {
    iso?: string;
    office_utc?: string;
    system_utc?: string;
    epoch_ms?: number;
    difference_ms?: number | null;
    host?: string;
    port?: number;
    stratum?: number;
    refid?: string;
    label?: string;
    root_delay_ms?: number;
    root_dispersion_ms?: number;
    status?: string;
  };
};

type LivePayload = {
  type?: string;
  utc: LiveUtc;
  nodes: CountryCardProps[];
};

type LiveDataContextValue = {
  live: LivePayload | null;
  apiState: 'connecting' | 'live' | 'offline';
  activityFeed: string[];
  officeSnapshot: LiveUtc['office'] | null;
};

const LiveDataContext = React.createContext<LiveDataContextValue | null>(null);

const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:8000';

export function LiveDataProvider({ children }: { children: React.ReactNode }) {
  const [live, setLive] = React.useState<LivePayload | null>(null);
  const [apiState, setApiState] = React.useState<'connecting' | 'live' | 'offline'>('connecting');
  const [activityFeed, setActivityFeed] = React.useState<string[]>([]);
  const [officeSnapshot, setOfficeSnapshot] = React.useState<LiveUtc['office'] | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    const fetchInitialData = async () => {
      // Try the configured API_BASE first, then fall back to swapped localhost/127.0.0.1
      const altBase = API_BASE.includes('localhost') ? API_BASE.replace('localhost', '127.0.0.1') : API_BASE.replace('127.0.0.1', 'localhost');
      const tryFetch = async (base: string) => {
        const [utcResponse, nodesResponse] = await Promise.all([
          fetch(`${base}/api/utc`),
          fetch(`${base}/api/nodes`),
        ]);
        if (!utcResponse.ok || !nodesResponse.ok) throw new Error('bad response');
        const utc = (await utcResponse.json()) as LiveUtc;
        const nodes = (await nodesResponse.json()) as CountryCardProps[];
        return { utc, nodes };
      };

      try {
        const { utc, nodes } = await tryFetch(API_BASE);
        if (cancelled) return;
        setLive({ utc, nodes });
        setOfficeSnapshot(
          utc.office ?? {
            iso: utc.iso,
            epoch_ms: utc.epoch_ms,
            host: (typeof window !== 'undefined' && window.location.hostname) || 'backend',
            port: 0,
            label: 'BACKEND',
          },
        );
        setActivityFeed((s) => [`${new Date().toISOString()} • Initial data loaded (${nodes.length} nodes)`, ...s].slice(0, 50));
      } catch (err1) {
        console.warn('Primary API_BASE failed, trying alternate host', err1);
        try {
          const { utc, nodes } = await tryFetch(altBase);
          if (cancelled) return;
          setLive({ utc, nodes });
          setOfficeSnapshot(
            utc.office ?? {
              iso: utc.iso,
              epoch_ms: utc.epoch_ms,
              host: (typeof window !== 'undefined' && window.location.hostname) || 'backend',
              port: 0,
              label: 'BACKEND',
            },
          );
          setActivityFeed((s) => [`${new Date().toISOString()} • Initial data loaded (${nodes.length} nodes)`, ...s].slice(0, 50));
        } catch (err2) {
          console.error('Failed to fetch initial data from both primary and alternate API bases', err2);
        }
      }
    };

    fetchInitialData();

    const wsBase = API_BASE.replace(/^http/, 'ws');
    const altWsBase = wsBase.includes('localhost') ? wsBase.replace('localhost', '127.0.0.1') : wsBase.replace('127.0.0.1', 'localhost');

    // Helper to attempt WS connect with fallback
    const connectWs = (base: string) => new Promise<WebSocket>((resolve, reject) => {
      try {
        const s = new WebSocket(`${base}/ws/live`);
        const onOpen = () => {
          s.removeEventListener('open', onOpen);
          s.removeEventListener('error', onErr);
          resolve(s);
        };
        const onErr = (e: any) => {
          s.removeEventListener('open', onOpen);
          s.removeEventListener('error', onErr);
          reject(e);
        };
        s.addEventListener('open', onOpen);
        s.addEventListener('error', onErr);
      } catch (e) {
        reject(e);
      }
    });

    let socket: WebSocket | null = null;
    (async () => {
      try {
        socket = await connectWs(wsBase);
      } catch (e) {
        console.warn('Primary WS failed, trying alternate', e);
        try {
          socket = await connectWs(altWsBase);
        } catch (e2) {
          console.error('Both WS connect attempts failed', e2);
          socket = new WebSocket(`${wsBase}/ws/live`); // fall back; will error
        }
      }

      if (!socket) return;

      socket!.onopen = () => {
        if (!cancelled) setApiState('live');
      };

      socket!.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data) as LivePayload;
          if (!cancelled && payload?.utc && Array.isArray(payload.nodes)) {
            setLive((current) => ({
              utc: {
                ...current?.utc,
                ...payload.utc,
                office: payload.utc.office ?? current?.utc.office,
              },
              nodes: payload.nodes,
              type: payload.type,
            }));
            if (payload.utc.office) setOfficeSnapshot(payload.utc.office);
            else setOfficeSnapshot({ iso: payload.utc.iso, epoch_ms: payload.utc.epoch_ms, host: 'backend', port: 0, label: 'BACKEND' });
            setApiState('live');
            setActivityFeed((s) => [`${new Date().toISOString()} • Live update received: ${payload.nodes.length} nodes`, ...s].slice(0, 50));
          }
        } catch {
          if (!cancelled) setApiState('offline');
        }
      };

      socket!.onerror = () => {
        if (!cancelled) setApiState('offline');
      };

      socket!.onclose = () => {
        if (!cancelled) setApiState('offline');
      };
    })();

    // Fallback poller: if WS fails or isn't connected, poll the UTC endpoint
    let pollId: number | null = null;
    const startPoller = () => {
      if (pollId !== null) return;
      pollId = window.setInterval(async () => {
        if (cancelled) return;
        if (apiState === 'live') return; // stop polling when WS becomes live
        const altBase = API_BASE.includes('localhost') ? API_BASE.replace('localhost', '127.0.0.1') : API_BASE.replace('127.0.0.1', 'localhost');
        const tryOne = async (base: string) => {
          const r = await fetch(`${base}/api/utc`);
          if (!r.ok) throw new Error('bad');
          return await r.json();
        };
        try {
          const utc = await tryOne(API_BASE);
          if (cancelled) return;
          setLive((cur) => ({ ...cur, utc } as any));
          setOfficeSnapshot(utc.office ?? { iso: utc.iso, epoch_ms: utc.epoch_ms, host: 'backend', port: 0, label: 'BACKEND' });
          setApiState('live');
        } catch (e1) {
          try {
            const utc = await tryOne(altBase);
            if (cancelled) return;
            setLive((cur) => ({ ...cur, utc } as any));
            setOfficeSnapshot(utc.office ?? { iso: utc.iso, epoch_ms: utc.epoch_ms, host: 'backend', port: 0, label: 'BACKEND' });
            setApiState('live');
          } catch (e2) {
            // still offline; no-op
          }
        }
      }, 1000);
    };

    startPoller();

    return () => {
      cancelled = true;
      try { socket?.close(); } catch {}
      if (pollId !== null) {
        clearInterval(pollId);
        pollId = null;
      }
    };
  }, []);

  return (
    <LiveDataContext.Provider value={{ live, apiState, activityFeed, officeSnapshot }}>
      {children}
    </LiveDataContext.Provider>
  );
}

export function useLiveData() {
  const context = React.useContext(LiveDataContext);
  if (!context) throw new Error('useLiveData must be used within LiveDataProvider');
  return context;
}
