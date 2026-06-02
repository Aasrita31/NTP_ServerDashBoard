import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { WorldMapBg } from "@/components/WorldMapBg";
import { DigitalUTC } from "@/components/DigitalUTC";
import { CountryCard, type CountryCardProps } from "@/components/CountryCard";
import { Activity, Radio, Shield, Satellite } from "lucide-react";
import CountryCompare from "@/components/CountryCompare";
import { TopNav } from "@/components/TopNav";
import { Sidebar } from "@/components/Sidebar";


export const Route = createFileRoute("/")({
  loader: async () => {
    return { utc: null, nodes: null };
  },
  component: Index,
  head: () => ({
    meta: [
      { title: "NTP Sync Command • Global Time Coordination" },
      { name: "description", content: "Real-time global NTP synchronization dashboard — military-grade time coordination across continents." },
    ],
  }),
});

const COUNTRIES = [
  { flag: "🇮🇳", iso: "in", name: "India",          code: "IND", tz: "Asia/Kolkata",                   offsetLabel: "UTC +05:30", accent: "#012169", peer: "time.nplindia.gov.in",  refid: ".GPS.",  stratum: 1, baseRtt: 142.4, baseDrift:  0.21, poll: 8 },
  { flag: "🇺🇸", iso: "us", name: "United States",  code: "USA", tz: "America/New_York",               offsetLabel: "UTC −05:00", accent: "#3C3B6E", peer: "time.nist.gov",         refid: ".NIST", stratum: 1, baseRtt:  94.6, baseDrift: -0.08, poll: 8 },
  { flag: "🇯🇵", iso: "jp", name: "Japan",          code: "JPN", tz: "Asia/Tokyo",                     offsetLabel: "UTC +09:00", accent: "#BC002D", peer: "ntp.nict.jp",           refid: ".JJY.",  stratum: 1, baseRtt: 238.7, baseDrift:  0.42, poll: 9 },
  { flag: "🇩🇪", iso: "de", name: "Germany",        code: "DEU", tz: "Europe/Berlin",                  offsetLabel: "UTC +01:00", accent: "#012169", peer: "ptbtime1.ptb.de",       refid: ".DCFa.", stratum: 1, baseRtt:  12.3, baseDrift: -0.04, poll: 7 },
  { flag: "🇦🇺", iso: "au", name: "Australia",      code: "AUS", tz: "Australia/Sydney",               offsetLabel: "UTC +11:00", accent: "#00247D", peer: "ntp1.tpg.com.au",       refid: ".GPS.",  stratum: 1, baseRtt: 296.1, baseDrift:  0.55, poll: 9 },
  { flag: "🇦🇪", iso: "ae", name: "UAE",            code: "ARE", tz: "Asia/Dubai",                     offsetLabel: "UTC +04:00", accent: "#00732F", peer: "time.etisalat.ae",      refid: ".GPS.",  stratum: 2, baseRtt:  72.9, baseDrift:  0.18, poll: 8 },
  { flag: "🇸🇬", iso: "sg", name: "Singapore",      code: "SGP", tz: "Asia/Singapore",                 offsetLabel: "UTC +08:00", accent: "#EF3340", peer: "ntp.singnet.com.sg",    refid: ".PPS.",  stratum: 1, baseRtt: 214.5, baseDrift:  0.31, poll: 9 },
  { flag: "🇨🇦", iso: "ca", name: "Canada",         code: "CAN", tz: "America/Toronto",                offsetLabel: "UTC −05:00", accent: "#FF0000", peer: "time.chu.nrc.ca",       refid: ".CHU.",  stratum: 1, baseRtt:  88.2, baseDrift: -0.11, poll: 8 },
  { flag: "🇬🇧", iso: "gb", name: "United Kingdom", code: "GBR", tz: "Europe/London",                  offsetLabel: "UTC +00:00", accent: "#012169", peer: "ntp1.npl.co.uk",        refid: ".MSF.",  stratum: 1, baseRtt:   9.8, baseDrift: -0.02, poll: 7 },
  { flag: "🇫🇷", iso: "fr", name: "France",         code: "FRA", tz: "Europe/Paris",                   offsetLabel: "UTC +01:00", accent: "#0055A4", peer: "ntp.obspm.fr",          refid: ".GPS.",  stratum: 1, baseRtt:  11.4, baseDrift:  0.03, poll: 7 },
  { flag: "🇧🇷", iso: "br", name: "Brazil",         code: "BRA", tz: "America/Sao_Paulo",              offsetLabel: "UTC −03:00", accent: "#009C3B", peer: "a.ntp.br",              refid: ".GPS.",  stratum: 1, baseRtt: 218.6, baseDrift:  0.27, poll: 9 },
  { flag: "🇰🇷", iso: "kr", name: "South Korea",    code: "KOR", tz: "Asia/Seoul",                     offsetLabel: "UTC +09:00", accent: "#CD2E3A", peer: "time.kriss.re.kr",      refid: ".PPS.",  stratum: 1, baseRtt: 232.4, baseDrift:  0.39, poll: 9 },
  { flag: "🇨🇳", iso: "cn", name: "China",          code: "CHN", tz: "Asia/Shanghai",                  offsetLabel: "UTC +08:00", accent: "#DE2910", peer: "ntp.aliyun.com",        refid: ".BPC.",  stratum: 2, baseRtt: 226.0, baseDrift:  0.34, poll: 9 },
  { flag: "🇷🇺", iso: "ru", name: "Russia",         code: "RUS", tz: "Europe/Moscow",                  offsetLabel: "UTC +03:00", accent: "#0039A6", peer: "ntp1.vniiftri.ru",      refid: ".GLNS.", stratum: 1, baseRtt:  44.7, baseDrift:  0.15, poll: 8 },
  { flag: "🇮🇹", iso: "it", name: "Italy",          code: "ITA", tz: "Europe/Rome",                    offsetLabel: "UTC +01:00", accent: "#008C45", peer: "ntp1.inrim.it",         refid: ".CSm.",  stratum: 1, baseRtt:  18.6, baseDrift:  0.05, poll: 7 },
  { flag: "🇪🇸", iso: "es", name: "Spain",          code: "ESP", tz: "Europe/Madrid",                  offsetLabel: "UTC +01:00", accent: "#AA151B", peer: "hora.roa.es",           refid: ".GPS.",  stratum: 1, baseRtt:  22.3, baseDrift:  0.07, poll: 7 },
  { flag: "🇳🇱", iso: "nl", name: "Netherlands",    code: "NLD", tz: "Europe/Amsterdam",               offsetLabel: "UTC +01:00", accent: "#AE1C28", peer: "ntp.time.nl",           refid: ".PPS.",  stratum: 1, baseRtt:   8.4, baseDrift: -0.03, poll: 7 },
  { flag: "🇫🇮", iso: "fi", name: "Finland",        code: "FIN", tz: "Europe/Helsinki",                offsetLabel: "UTC +02:00", accent: "#003580", peer: "ntp1.mikes.fi",         refid: ".PPS.",  stratum: 1, baseRtt:  31.6, baseDrift:  0.04, poll: 7 },
  { flag: "🇵🇱", iso: "pl", name: "Poland",         code: "POL", tz: "Europe/Warsaw",                 offsetLabel: "UTC +01:00", accent: "#DC143C", peer: "ntp.man.poznan.pl",     refid: ".GPS.",  stratum: 1, baseRtt:  25.8, baseDrift:  0.06, poll: 7 },
  { flag: "🇨🇭", iso: "ch", name: "Switzerland",    code: "CHE", tz: "Europe/Zurich",                  offsetLabel: "UTC +01:00", accent: "#DA291C", peer: "ntp11.metas.ch",        refid: ".CSm.",  stratum: 1, baseRtt:  14.1, baseDrift:  0.02, poll: 7 },
  { flag: "🇸🇪", iso: "se", name: "Sweden",         code: "SWE", tz: "Europe/Stockholm",               offsetLabel: "UTC +01:00", accent: "#006AA7", peer: "ntp1.sp.se",            refid: ".CSm.",  stratum: 1, baseRtt:  26.8, baseDrift:  0.06, poll: 7 },
  { flag: "🇳🇴", iso: "no", name: "Norway",         code: "NOR", tz: "Europe/Oslo",                    offsetLabel: "UTC +01:00", accent: "#BA0C2F", peer: "ntp.justervesenet.no",  refid: ".PPS.",  stratum: 1, baseRtt:  29.7, baseDrift:  0.09, poll: 8 },
  { flag: "🇿🇦", iso: "za", name: "South Africa",   code: "ZAF", tz: "Africa/Johannesburg",            offsetLabel: "UTC +02:00", accent: "#007749", peer: "ntp1.meraka.csir.co.za",refid: ".GPS.",  stratum: 1, baseRtt: 168.3, baseDrift:  0.22, poll: 8 },
  { flag: "🇲🇽", iso: "mx", name: "Mexico",         code: "MEX", tz: "America/Mexico_City",            offsetLabel: "UTC −06:00", accent: "#006847", peer: "cronos.cenam.mx",       refid: ".GPS.",  stratum: 1, baseRtt: 142.8, baseDrift:  0.17, poll: 8 },
  { flag: "🇦🇷", iso: "ar", name: "Argentina",      code: "ARG", tz: "America/Argentina/Buenos_Aires", offsetLabel: "UTC −03:00", accent: "#74ACDF", peer: "hora.oan.uncu.edu.ar",  refid: ".GPS.",  stratum: 2, baseRtt: 232.5, baseDrift:  0.29, poll: 9 },
  { flag: "🇹🇷", iso: "tr", name: "Turkey",         code: "TUR", tz: "Europe/Istanbul",                offsetLabel: "UTC +03:00", accent: "#E30A17", peer: "time.ulakbim.gov.tr",   refid: ".GPS.",  stratum: 1, baseRtt:  56.4, baseDrift:  0.12, poll: 8 },
  { flag: "🇸🇦", iso: "sa", name: "Saudi Arabia",   code: "SAU", tz: "Asia/Riyadh",                    offsetLabel: "UTC +03:00", accent: "#006C35", peer: "time.kacst.edu.sa",     refid: ".PPS.",  stratum: 1, baseRtt:  78.9, baseDrift:  0.19, poll: 8 },
  { flag: "🇮🇱", iso: "il", name: "Israel",         code: "ISR", tz: "Asia/Jerusalem",                 offsetLabel: "UTC +02:00", accent: "#0038B8", peer: "ntp.inp.org.il",        refid: ".GPS.",  stratum: 1, baseRtt:  61.2, baseDrift:  0.14, poll: 8 },
  { flag: "🇪🇬", iso: "eg", name: "Egypt",          code: "EGY", tz: "Africa/Cairo",                   offsetLabel: "UTC +02:00", accent: "#C8102E", peer: "time.nis.sci.eg",       refid: ".GPS.",  stratum: 2, baseRtt:  68.5, baseDrift:  0.16, poll: 8 },
  { flag: "🇳🇬", iso: "ng", name: "Nigeria",        code: "NGA", tz: "Africa/Lagos",                   offsetLabel: "UTC +01:00", accent: "#008751", peer: "ng.pool.ntp.org",       refid: "0x4e3b", stratum: 2, baseRtt: 124.6, baseDrift:  0.24, poll: 9 },
  { flag: "🇰🇪", iso: "ke", name: "Kenya",          code: "KEN", tz: "Africa/Nairobi",                 offsetLabel: "UTC +03:00", accent: "#BB0000", peer: "ke.pool.ntp.org",       refid: "0x8a17", stratum: 2, baseRtt: 152.4, baseDrift:  0.26, poll: 9 },
  { flag: "🇹🇭", iso: "th", name: "Thailand",       code: "THA", tz: "Asia/Bangkok",                   offsetLabel: "UTC +07:00", accent: "#A51931", peer: "time.nimt.or.th",       refid: ".GPS.",  stratum: 1, baseRtt: 198.7, baseDrift:  0.28, poll: 9 },
  { flag: "🇮🇩", iso: "id", name: "Indonesia",      code: "IDN", tz: "Asia/Jakarta",                   offsetLabel: "UTC +07:00", accent: "#FF0000", peer: "ntp.bmkg.go.id",        refid: ".GPS.",  stratum: 1, baseRtt: 234.1, baseDrift:  0.33, poll: 9 },
  { flag: "🇵🇭", iso: "ph", name: "Philippines",    code: "PHL", tz: "Asia/Manila",                    offsetLabel: "UTC +08:00", accent: "#0038A8", peer: "ph.pool.ntp.org",       refid: "0xc104", stratum: 2, baseRtt: 248.6, baseDrift:  0.36, poll: 9 },
  { flag: "�🇾", iso: "my", name: "Malaysia",       code: "MYS", tz: "Asia/Kuala_Lumpur",              offsetLabel: "UTC +08:00", accent: "#003DA5", peer: "my.pool.ntp.org",       refid: ".GPS.",  stratum: 2, baseRtt: 224.2, baseDrift:  0.32, poll: 9 },
  { flag: "�🇻🇳", iso: "vn", name: "Vietnam",        code: "VNM", tz: "Asia/Ho_Chi_Minh",               offsetLabel: "UTC +07:00", accent: "#DA251D", peer: "vn.pool.ntp.org",       refid: "0x7f21", stratum: 2, baseRtt: 212.4, baseDrift:  0.31, poll: 9 },
  { flag: "🇳🇿", iso: "nz", name: "New Zealand",    code: "NZL", tz: "Pacific/Auckland",               offsetLabel: "UTC +13:00", accent: "#00247D", peer: "ntp.massey.ac.nz",      refid: ".GPS.",  stratum: 1, baseRtt: 318.2, baseDrift:  0.48, poll: 9 },
] as const;

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
      offset_ms?: number | null;
      delay_ms?: number | null;
      originate_ms?: number;
      receive_ms?: number;
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

const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8000";

function StatChip({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="glass rounded-lg px-4 py-2 flex items-center gap-3">
      <Icon className="w-4 h-4 text-cyan-glow" />
      <div>
        <div className="text-[9px] font-mono tracking-widest text-muted-foreground">{label}</div>
        <div className="text-sm font-mono font-bold text-cyan-glow">{value}</div>
      </div>
    </div>
  );
}

function Index() {
  const INITIAL_VISIBLE_NODES = 8;
  const initialData = Route.useLoaderData();
  const [bgVariant, setBgVariant] = useState<'darker' | 'brighter'>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('bgVariant') as 'darker' | 'brighter' | null;
        if (saved === 'darker' || saved === 'brighter') return saved;
      } catch {
        // ignore storage failures
      }
    }
    return 'darker';
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('bgVariant') as 'darker' | 'brighter' | null;
      if (saved === 'darker' || saved === 'brighter') setBgVariant(saved);
    } catch (e) {
      // ignore (SSR)
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('bgVariant', bgVariant);
    } catch (e) {
      // ignore
    }
  }, [bgVariant]);

  const mainStyle = useMemo(() => {
    if (bgVariant === 'brighter') {
      const bright: React.CSSProperties = {
        '--primary': '#1dbcf7',
        '--accent': '#3b82f6',
        '--ring': '#22d3ee',
        '--cyan-glow': '#2dd4ff',
        '--neon': '#60a5fa',
        '--online': '#14b8a6',
        '--background': '#f8fcff',
        '--foreground': '#0f172a',
        '--card': 'rgba(255,255,255,0.72)',
        '--card-foreground': '#0f172a',
        '--popover': 'rgba(255,255,255,0.92)',
        '--popover-foreground': '#0f172a',
        '--muted': 'rgba(15,23,42,0.04)',
        '--muted-foreground': 'rgba(15,23,42,0.58)',
        '--border': 'rgba(34,211,238,0.14)',
        '--input': 'rgba(15,23,42,0.06)',
        '--secondary-container': 'rgba(34,211,238,0.18)',
        '--on-secondary-container': '#0f172a',
        '--primary-container': 'rgba(37,99,235,0.16)',
        '--on-primary-container': '#0f172a',
        '--surface': 'rgba(255,255,255,0.58)',
        '--surface-container-lowest': 'rgba(255,255,255,0.82)',
        '--surface-container-low': 'rgba(250,253,255,0.84)',
        '--surface-container': 'rgba(244,249,255,0.90)',
        '--surface-container-high': 'rgba(235,244,252,0.92)',
        '--surface-container-highest': 'rgba(225,237,248,0.95)',
        '--on-surface-variant': '#475569',
        '--outline-variant': 'rgba(15,23,42,0.10)',
        '--grid': 'rgba(34,211,238,0.08)',
      } as React.CSSProperties;
      return {
        background:
          'radial-gradient(circle at 18% 16%, rgba(45,212,255,0.18), transparent 22%), radial-gradient(circle at 82% 10%, rgba(59,130,246,0.12), transparent 22%), radial-gradient(circle at 50% 110%, rgba(15,118,255,0.10), transparent 36%), linear-gradient(180deg, #fbfdff 0%, #eef7ff 46%, #eaf4ff 100%)',
        color: '#0f172a',
        ...bright,
      } as React.CSSProperties;
    }

    return {} as React.CSSProperties;
  }, [bgVariant]);
  const [live, setLive] = useState<LivePayload | null>(null);
  const [apiState, setApiState] = useState<"connecting" | "live" | "offline">("connecting");
  const [activityFeed, setActivityFeed] = useState<string[]>(() => []);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [officeSnapshot, setOfficeSnapshot] = useState<LiveUtc["office"] | null>(null);
  const [clockNowMs, setClockNowMs] = useState(() => Date.now());
  const [officeSnapshotAtMs, setOfficeSnapshotAtMs] = useState(() => Date.now());

  // Fetch initial data client-side with optimized strategy: try relative URL first (Vite proxy),
  // then fallback to configured API_BASE, with short timeouts for fast failure detection.
  useEffect(() => {
    let cancelled = false;
    const timeout = 3000; // 3s timeout per request
    
    const fetchWithTimeout = async (url: string) => {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      try {
        console.log('[index] Fetching from:', url);
        const [utcResp, nodesResp] = await Promise.all([
          fetch(url, { signal: controller.signal }),
          fetch(url.replace('/api/utc', '/api/nodes'), { signal: controller.signal }),
        ]);
        clearTimeout(id);
        console.log('[index] Responses:', { utcStatus: utcResp.status, nodesStatus: nodesResp.status });
        if (!utcResp.ok || !nodesResp.ok) return null;
        const utc = await utcResp.json() as LiveUtc;
        const nodes = await nodesResp.json() as CountryCardProps[];
        console.log('[index] Initial fetch success, office data:', utc.office ? 'present' : 'missing');
        return { utc, nodes };
      } catch (e) {
        clearTimeout(id);
        console.error('[index] Fetch error:', String(e));
        return null;
      }
    };

    (async () => {
      // Try relative URL first (Vite proxy in dev, native on prod)
      let result = await fetchWithTimeout('/api/utc');
      
      // Quick fallback to configured API_BASE if relative fails
      if (!result && API_BASE !== '') {
        console.log('[index] Fallback to API_BASE:', API_BASE);
        result = await fetchWithTimeout(`${API_BASE}/api/utc`);
      }
      
      if (cancelled) return;
      if (result) {
        console.log('[index] Setting live data');
        setLive({ utc: result.utc, nodes: result.nodes });
        setOfficeSnapshot(result.utc.office ?? null);
        setActivityFeed((s) => [`${new Date().toISOString()} • Initial data loaded (${result.nodes.length} nodes)`, ...s].slice(0, 50));
        setApiState('live');
      } else {
        console.log('[index] No initial data, starting polling');
      }
    })();

    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const wsTimeout = 2000; // 2s timeout for WS connection
    const pollInterval = 30000; // 30 seconds polling ONLY if WebSocket fails

    // Try WebSocket with minimal timeout, fallback to polling only as last resort
    let socket: WebSocket | null = null;
    let pollId: number | null = null;

    const connectWs = () => new Promise<WebSocket>((resolve, reject) => {
      try {
        // Direct backend connection (bypass Vite proxy for WebSocket)
        const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        const url = `${protocol}://localhost:8000/ws/live`;
        console.log('[WS] Connecting to backend:', url);
        const s = new WebSocket(url);
        const timeoutId = setTimeout(() => {
          console.log('[WS] ⏱️ Timeout - no connection');
          try { s.close(); } catch {}
          reject(new Error('WS timeout'));
        }, wsTimeout);

        const onopen = () => {
          clearTimeout(timeoutId);
          s.removeEventListener('open', onopen);
          s.removeEventListener('error', onerror);
          console.log('[WS] ✅ Connected - using WebSocket (no polling!)');
          resolve(s);
        };
        const onerror = () => {
          clearTimeout(timeoutId);
          s.removeEventListener('open', onopen);
          s.removeEventListener('error', onerror);
          console.log('[WS] ❌ Connection failed - will use polling fallback');
          reject(new Error('WS error'));
        };
        s.addEventListener('open', onopen);
        s.addEventListener('error', onerror);
      } catch (e) {
        console.error('[WS] Exception:', e);
        reject(e);
      }
    });

    const startPolling = () => {
      if (pollId !== null) return;
      console.log('[Polling] ⚠️  WebSocket unavailable - polling every 30s (reduced from 2s)');
      pollId = window.setInterval(async () => {
        if (cancelled) return;
        try {
          const controller = new AbortController();
          const id = setTimeout(() => controller.abort(), 2000);
          const r = await fetch('/api/utc', { signal: controller.signal });
          clearTimeout(id);
          if (!r.ok) return;
          const utc = await r.json() as LiveUtc;
          if (cancelled) return;
          setLive((cur) => ({ ...cur, utc } as any));
          setOfficeSnapshot(utc.office ?? null);
          if (apiState !== 'live') setApiState('live');
        } catch (e) {
          // Silent fail on polling
        }
      }, pollInterval); // 30 seconds instead of 500ms!
    };

    (async () => {
      try {
        socket = await connectWs();
        if (cancelled) {
          socket.close();
          return;
        }

        console.log('[WS] 🔄 Ready for live updates');
        setApiState('live');

        socket.onmessage = (event) => {
          try {
            const payload = JSON.parse(event.data) as LivePayload;
            if (!cancelled && payload?.utc) {
              setLive((current) => ({
                utc: { ...current?.utc, ...payload.utc, office: payload.utc.office ?? current?.utc.office },
                nodes: payload.nodes ?? current?.nodes,
                type: payload.type,
              }));
              if (payload.utc.office) setOfficeSnapshot(payload.utc.office);
            }
          } catch (e) {
            console.error('[WS] Parse error:', e);
          }
        };

        socket.onerror = () => {
          if (!cancelled) {
            console.log('[WS] ❌ WebSocket error');
            setApiState('offline');
            startPolling();
          }
        };

        socket.onclose = () => {
          if (!cancelled) {
            console.log('[WS] ❌ WebSocket closed - switching to polling');
            setApiState('offline');
            startPolling();
          }
        };
      } catch (e) {
        // WS failed immediately; use polling as fallback
        if (!cancelled) {
          console.log('[WS] 💤 WebSocket unavailable - using polling');
          startPolling();
        }
      }
    })();

    return () => {
      cancelled = true;
      try { socket?.close(); } catch {}
      if (pollId !== null) { clearInterval(pollId); }
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNowMs(Date.now());
    }, 100); // 100ms update for smooth second-by-second time movement

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let frameId = 0;

    const tick = () => {
      setClockNowMs(Date.now());
      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frameId);
  }, []);

  const nodes = live?.nodes ?? COUNTRIES;
  const [localNodes, setLocalNodes] = useState<CountryCardProps[]>(() => {
    // Initialize with one clone added by default
    const base = COUNTRIES[0] as CountryCardProps;
    const suffix = String(Date.now()).slice(-3);
    const clone: CountryCardProps = { ...base, code: `${base.code}_${suffix}` };
    return [...COUNTRIES, clone] as CountryCardProps[];
  });
  useEffect(() => {
    setLocalNodes([...nodes]);
  }, [nodes]);

  const [toClone, setToClone] = useState<string>(COUNTRIES[0].code);
  const [showAllNodes, setShowAllNodes] = useState(false);

  const [compareMode, setCompareMode] = useState(false);
  const [compareSelection, setCompareSelection] = useState<string[]>([]);

  const compareLabelA = compareSelection[0]
    ? (localNodes.find((n) => n.code === compareSelection[0])?.name + " • " + compareSelection[0])
    : null;
  const compareLabelB = compareSelection[1]
    ? (localNodes.find((n) => n.code === compareSelection[1])?.name + " • " + compareSelection[1])
    : null;

  const visibleNodes = showAllNodes
    ? localNodes
    : localNodes.slice(0, INITIAL_VISIBLE_NODES);

  useEffect(() => {
    // Lock page scroll until the user explicitly expands the node list.
    document.body.style.overflow = showAllNodes ? "auto" : "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showAllNodes]);

  function addClone(code: string) {
    const base = (COUNTRIES.find((c) => c.code === code) || COUNTRIES[0]) as any;
    const suffix = String(Date.now()).slice(-3);
    const clone = { ...base, code: `${base.code}_${suffix}` } as any;
    setLocalNodes((s) => [...s, clone]);
  }
  const connectionLabel = useMemo(
    () => (apiState === "live" ? "API LIVE" : apiState === "connecting" ? "CONNECTING" : "API OFFLINE"),
    [apiState],
  );

  const officeUtc = live?.utc?.office;
  const officeData = officeUtc ?? officeSnapshot;
  const officeUtcIso = officeData?.iso ?? officeData?.office_utc ?? null;
  const officeBaseMs = officeData?.epoch_ms
    ?? (officeUtcIso ? new Date(officeUtcIso).getTime() : null);
  const browserUtcMs = clockNowMs;
  const masterDisplayMs = browserUtcMs;
  const officeDisplayMs = officeBaseMs !== null ? officeBaseMs + (clockNowMs - officeSnapshotAtMs) : masterDisplayMs;
  const utcDiffMs = officeBaseMs !== null ? officeBaseMs - browserUtcMs : null;
  const officeDelayMs = typeof officeData?.delay_ms === "number"
    ? officeData.delay_ms
    : typeof officeData?.root_delay_ms === "number"
      ? officeData.root_delay_ms
      : null;
  const officeDriftMs = typeof officeData?.offset_ms === "number"
    ? officeData.offset_ms
    : typeof officeData?.difference_ms === "number"
      ? officeData.difference_ms
      : utcDiffMs;
  const delayState = officeDelayMs === null
    ? { label: 'SYNCING', tone: 'text-teal-600 border-teal-300 bg-teal-50', dot: 'bg-teal-500' }
    : officeDelayMs < 250
      ? { label: 'SYNCHRONIZED', tone: 'text-emerald-600 border-emerald-300 bg-emerald-50', dot: 'bg-emerald-500' }
      : officeDelayMs < 500
        ? { label: 'WATCH', tone: 'text-amber-600 border-amber-300 bg-amber-50', dot: 'bg-amber-500' }
        : { label: 'OUT OF SYNC', tone: 'text-rose-600 border-rose-300 bg-rose-50', dot: 'bg-rose-500' };
  const driftState = officeDriftMs === null
    ? { label: 'SYNCING', tone: 'text-teal-600 border-teal-300 bg-teal-50', dot: 'bg-teal-500' }
    : Math.abs(officeDriftMs) < 0.15
      ? { label: 'SYNCHRONIZED', tone: 'text-emerald-600 border-emerald-300 bg-emerald-50', dot: 'bg-emerald-500' }
      : Math.abs(officeDriftMs) < 0.35
        ? { label: 'WATCH', tone: 'text-amber-600 border-amber-300 bg-amber-50', dot: 'bg-amber-500' }
        : { label: 'OUT OF SYNC', tone: 'text-rose-600 border-rose-300 bg-rose-50', dot: 'bg-rose-500' };
  const formatDelta = useMemo(() => (ms: number | null) => {
    if (ms === null) return "-- ms";
    const sign = ms >= 0 ? "+" : "-";
    return `${sign}${Math.abs(ms).toFixed(3)} ms`;
  }, []);

  const officeDisplay = useMemo(
    () => officeBaseMs
      ? new Date(officeBaseMs).toISOString().replace("T", " ").replace("Z", " UTC")
      : "OFFICE NTP DATA NOT YET AVAILABLE",
    [officeBaseMs]
  );

  useEffect(() => {
    if (officeBaseMs !== null) {
      setOfficeSnapshotAtMs(Date.now());
    }
  }, [officeBaseMs]);

  return (
    <div
      className={`relative min-h-screen overflow-hidden ${bgVariant === 'brighter' ? 'theme-bright' : 'theme-dark'}`}
      style={mainStyle}
      data-theme={bgVariant}
      data-sidebar-state={sidebarCollapsed ? 'collapsed' : 'expanded'}
    >
      <TopNav
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        sidebarOpen={sidebarOpen}
        themeVariant={bgVariant}
        onThemeVariantChange={setBgVariant}
      />
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
      />
      <WorldMapBg variant={bgVariant} />

      <main className={`relative z-10 pt-24 px-3 sm:px-6 lg:px-8 xl:px-10 py-4 min-h-screen transition-[margin,padding] duration-300 ${sidebarCollapsed ? 'lg:ml-[92px]' : 'lg:ml-[280px]'}`}>
      <div className="max-w-[1800px] mx-auto min-w-0">
        {/* Top bar */}
        <header className="dashboard-hero flex flex-col items-center mb-4 sm:mb-6 text-center px-2 sm:px-4 min-w-0">
          <div className="hero-orbit" aria-hidden />
          <h1 className="animate-title-glow mt-1 sm:mt-2 font-black tracking-[0.08em] sm:tracking-[0.1em] bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent bright-hero-title max-w-[min(100%,72rem)] whitespace-normal text-balance text-[clamp(1.15rem,2.2vw,4rem)] leading-[0.95] px-2" style={{ 
            backgroundSize: '220% auto',
            filter: 'drop-shadow(0 0 12px rgba(139, 92, 246, 0.38)) drop-shadow(0 0 28px rgba(168, 85, 247, 0.24))',
            textWrap: 'balance',
          }}>PRECISION • TIME • COORDINATION • CENTER</h1>
          <div className="flex items-center gap-2 mt-2 sm:mt-3">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 animate-pulse shadow-[0_0_12px_rgba(168,85,247,0.55)]"></span>
            <div className="text-[10px] sm:text-[12px] text-violet-600/75 font-mono tracking-[0.3em] sm:tracking-[0.38em] uppercase font-semibold bright-hero-subtitle">Global Synchronization Network</div>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 animate-pulse shadow-[0_0_12px_rgba(168,85,247,0.55)]"></span>
          </div>
        </header>

        {/* Premium Synchronization Dashboard - Left/Right Clock Layout */}
        <section className="mt-2 mb-8 sm:mb-12 w-full min-w-0 light-sync-stage">
          {/* Master UTC Clock (Left) | Sync Comparison (Center) | IITTNIF Office Clock (Right) */}
          <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.12fr)_minmax(320px,0.72fr)_minmax(0,1.12fr)] items-stretch gap-6 sm:gap-8 md:gap-10 w-full min-w-0">
            
            {/* LEFT: Master UTC Clock */}
            <div className="flex flex-col items-center justify-center min-h-[260px] xl:min-h-[320px] min-w-0">
              <div className="relative w-full max-w-[720px] bright-clock-area min-w-0">
                <div className="absolute inset-8 rounded-full bg-[radial-gradient(circle,rgba(45,212,255,0.28)_0%,rgba(59,130,246,0.14)_34%,transparent_72%)] blur-2xl opacity-80" />

                <div className="glass bright-clock-card overflow-visible rounded-[28px] border border-cyan-200/35 p-5 sm:p-6 lg:p-8 text-center bg-gradient-to-br from-white/80 via-white/55 to-sky-50/75 min-w-0">
                  <div className="text-[9px] sm:text-[10px] font-mono tracking-[0.4em] text-cyan-glow font-bold mb-2 sm:mb-3">MASTER • UTC</div>
                  
                  {/* Digital display (replaces analog) */}
                  <div className="text-center bright-digital-stage">
                    <DigitalUTC variant="large" epochMs={masterDisplayMs} displayMs={masterDisplayMs} heading="◆ MASTER UTC ◆" footer="COORDINATED UNIVERSAL TIME" />
                  </div>
                </div>
              </div>
            </div>

            {/* CENTER: Synchronization Comparison Indicator */}
            <div className="flex flex-col items-center justify-center min-h-[260px] xl:min-h-[320px] min-w-0">
              {/* Animated sync beam line */}
              <div className="absolute hidden xl:block h-px w-full max-w-[720px] mx-auto" style={{
                background: 'linear-gradient(90deg, transparent, oklch(0.85_0.18_78/0.4) 20%, oklch(0.85_0.18_78/0.8) 50%, oklch(0.85_0.18_78/0.4) 80%, transparent)',
                animation: 'pulse 2s ease-in-out infinite',
                top: '50%',
                left: '50%',
                transform: 'translateX(-50%)'
              }} />
              
              <div className="relative w-full max-w-[420px] xl:max-w-[360px] min-w-0">
                      <div className="glass bright-sync-console rounded-[28px] border border-cyan-200/30 p-4 sm:p-5 lg:p-6 bg-gradient-to-br from-white/78 via-white/58 to-sky-50/70 min-w-0">
                  <div className="text-[9px] sm:text-[10px] font-mono tracking-[0.4em] text-cyan-glow/80 font-bold mb-4 sm:mb-6">SYNCHRONIZATION</div>
                  
                  {/* Delay card */}
                    <div className={`mb-4 p-3 rounded-2xl border border-cyan-200/30 ${bgVariant === 'brighter' ? 'bg-white/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_12px_24px_rgba(34,211,238,0.06)]' : 'bg-transparent shadow-none'}`}>
                    <div className="text-[8px] sm:text-[9px] font-mono tracking-[0.3em] text-muted-foreground mb-1">DELAY</div>
                    <div className="flex items-baseline justify-center gap-2">
                            <div className={`h-2.5 w-2.5 rounded-full ${delayState.dot} shadow-[0_0_14px_currentColor] animate-pulse`} />
                            <div className="text-xl sm:text-2xl font-mono font-bold text-cyan-600 tabular-nums">{formatDelta(officeDelayMs)}</div>
                    </div>
                          <div className={`mt-2 text-[8px] sm:text-[9px] font-mono ${delayState.tone.split(' ')[0]} tracking-[0.22em]`}>{delayState.label}</div>
                  </div>
                  
                  {/* Drift card */}
                    <div className={`p-3 rounded-2xl border border-cyan-200/30 ${bgVariant === 'brighter' ? 'bg-white/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_12px_24px_rgba(34,211,238,0.06)]' : 'bg-transparent shadow-none'}`}>
                    <div className="text-[8px] sm:text-[9px] font-mono tracking-[0.3em] text-muted-foreground mb-1">DRIFT</div>
                    <div className="flex items-baseline justify-center gap-2">
                            <div className={`h-2.5 w-2.5 rounded-full ${driftState.dot} shadow-[0_0_14px_currentColor] animate-pulse`} />
                            <div className="text-xl sm:text-2xl font-mono font-bold text-cyan-600 tabular-nums">{formatDelta(officeDriftMs)}</div>
                    </div>
                          <div className={`mt-2 text-[8px] sm:text-[9px] font-mono ${driftState.tone.split(' ')[0]} tracking-[0.22em]`}>{driftState.label}</div>
                  </div>

                  {/* Offset indicator */}
                        <div className="mt-4 pt-3 border-t border-cyan-200/20">
                          <div className="text-[7px] sm:text-[8px] text-cyan-600/55 font-mono tracking-[0.25em]">Offset</div>
                          <div className="text-sm sm:text-base font-mono font-bold text-cyan-600 mt-1">{formatDelta(utcDiffMs)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: IITTNIF Office NTP Clock */}
            <div className="flex flex-col items-center justify-center min-h-[260px] xl:min-h-[320px] min-w-0">
              <div className="relative w-full max-w-[720px] bright-clock-area min-w-0">
                <div className="absolute inset-8 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.26)_0%,rgba(45,212,255,0.12)_34%,transparent_72%)] blur-2xl opacity-80" />
                <div className="glass bright-clock-card overflow-visible rounded-[28px] border border-sky-200/40 p-5 sm:p-6 lg:p-8 text-center bg-gradient-to-br from-white/80 via-white/60 to-sky-50/70 min-w-0">
                  <div className="text-[9px] sm:text-[10px] font-mono tracking-[0.4em] text-blue-400 font-bold mb-2 sm:mb-3">IITTNIF • NTP</div>

                  {/* Digital display (replaces analog) */}
                  <div className="text-center bright-digital-stage">
                    <DigitalUTC
                      variant="large"
                      epochMs={officeBaseMs ?? masterDisplayMs}
                      displayMs={officeDisplayMs}
                      tone="blue"
                      heading="◆ IITTNIF UTC ◆"
                      footer={`IITTNIF SERVER UTC • ${officeData?.host ?? '10.26.13.44'}`}
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Section heading */}
        <div className="flex items-center gap-2 sm:gap-4 mb-6 sm:mb-8 mt-8 sm:mt-12">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-glow/50 to-transparent" />
          <h2 className="text-[10px] sm:text-xs md:text-sm font-mono tracking-[0.3em] sm:tracking-[0.4em] md:tracking-[0.5em] text-cyan-glow text-glow whitespace-nowrap flex items-center gap-2 sm:gap-3">
            <span>◆</span>
            <span>GLOBAL NODES</span>
            <span>◆</span>
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-glow/50 to-transparent" />
        </div>

        {/* Cards grid */}

        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 overflow-x-auto">
          <button
            onClick={() => {
              setCompareMode((v) => !v);
              setCompareSelection([]);
            }}
            className={`px-3 sm:px-4 py-2 rounded text-xs sm:text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-colors ${compareMode ? "bg-cyan-glow text-background shadow-[0_0_15px_rgba(0,217,255,0.5)]" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
          >
            {compareMode ? "◆ COMPARING ◆" : "Compare"}
          </button>

          {compareMode && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              <div className="w-40 sm:w-48 px-3 py-2 bg-background/60 rounded border border-cyan-glow/20 text-[11px] sm:text-sm text-cyan-glow/80 font-mono truncate flex-shrink-0">
                {compareLabelA ?? "A: select"}
              </div>
              <div className="text-cyan-glow/40 text-xs flex-shrink-0">↔</div>
              <div className="w-40 sm:w-48 px-3 py-2 bg-background/60 rounded border border-cyan-glow/20 text-[11px] sm:text-sm text-cyan-glow/80 font-mono truncate flex-shrink-0">
                {compareLabelB ?? "B: select"}
              </div>
            </div>
          )}
        </div>

        <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4 lg:gap-5">
          {visibleNodes.map((c) => (
            <CountryCard
              key={c.code}
              {...c}
              compareMode={compareMode}
              onCompareSelect={(code) => {
                setCompareSelection((s) => {
                  if (s.includes(code)) return s.filter((x) => x !== code);
                  if (s.length >= 2) return [s[1], code];
                  return [...s, code];
                });
              }}
              compareSelected={compareSelection.includes(c.code)}
            />
          ))}
        </section>

        {!showAllNodes && localNodes.length > INITIAL_VISIBLE_NODES && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <button
              type="button"
              onClick={() => setShowAllNodes(true)}
              className="px-6 py-2.5 rounded-md bg-primary text-primary-foreground font-mono tracking-[0.2em] hover:opacity-90 transition-opacity shadow-[0_0_25px_rgba(245,158,11,0.45)] border border-primary/60"
            >
              SHOW MORE
            </button>
          </div>
        )}

        {compareSelection.length === 2 && (
          <div
            className="fixed inset-0 z-40 flex items-center justify-center p-6 bg-background/80 backdrop-blur-md"
            onClick={() => {
              setCompareSelection([]);
              setCompareMode(false);
            }}
          >
            <div className="w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
              <CountryCompare nodes={localNodes} selectedA={compareSelection[0]} selectedB={compareSelection[1]} />
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => {
                    setCompareSelection([]);
                    setCompareMode(false);
                  }}
                  className="px-3 py-2 rounded bg-muted text-muted-foreground"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 py-4 sm:py-6 px-2 text-[8px] sm:text-[9px] md:text-[10px] font-mono tracking-[0.2em] sm:tracking-[0.25em] text-muted-foreground border-t border-cyan-glow/10">
          <span className="text-center sm:text-left text-[7px] sm:text-[8px]">SYS://NTP.GLOBAL.MIL — SECURE</span>
          <span className="flex items-center gap-2 sm:gap-3">
            <span className="w-1.5 h-1.5 rounded-full bg-online animate-pulse" />
            <span className="truncate text-[8px] sm:text-[9px]">{connectionLabel} • {nodes.length}/{COUNTRIES.length}</span>
          </span>
          <span className="text-[7px] sm:text-[8px]">v24.11</span>
        </footer>
      </div>
      </main>
    </div>
  );
}
