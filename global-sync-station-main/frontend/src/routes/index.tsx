import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { WorldMapBg } from "@/components/WorldMapBg";
import { AnalogClock } from "@/components/AnalogClock";
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
  { flag: "🇵🇰", iso: "pk", name: "Pakistan",       code: "PAK", tz: "Asia/Karachi",                   offsetLabel: "UTC +05:00", accent: "#01411C", peer: "pk.pool.ntp.org",       refid: "0x4429", stratum: 2, baseRtt: 116.3, baseDrift:  0.20, poll: 9 },
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
    epoch_ms?: number;
    host?: string;
    port?: number;
    stratum?: number;
    refid?: string;
    label?: string;
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
  const initialData = Route.useLoaderData();
  const [bgVariant, setBgVariant] = useState<'darker' | 'brighter'>('darker');

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
    if (bgVariant !== 'brighter') return undefined;
    return {
      background: 'linear-gradient(180deg, #ffffff 0%, #f7fafc 100%)',
      color: '#0f172a',
      // CSS variables to override theme
      '--background': '#ffffff',
      '--foreground': '#0f172a',
      '--card': 'rgba(255,255,255,0.9)',
      '--card-foreground': '#0f172a',
      '--popover': 'rgba(255,255,255,0.95)',
      '--popover-foreground': '#0f172a',
      '--primary': '#06b6d4',
      '--primary-foreground': '#ffffff',
      '--muted': 'rgba(15,23,42,0.06)',
      '--muted-foreground': 'rgba(15,23,42,0.5)',
      '--accent': '#06b6d4',
      '--accent-foreground': '#ffffff',
      '--border': 'rgba(15,23,42,0.06)',
      '--input': 'rgba(15,23,42,0.04)',
      '--ring': '#06b6d4',
      '--cyan-glow': '#06b6d4',
      '--neon': '#06b6d4',
      '--online': '#06b6d4',
      '--grid': 'rgba(15,23,42,0.06)'
    } as React.CSSProperties;
  }, [bgVariant]);
  const [live, setLive] = useState<LivePayload | null>(null);
  const [apiState, setApiState] = useState<"connecting" | "live" | "offline">("connecting");
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [officeSnapshot, setOfficeSnapshot] = useState<LiveUtc["office"] | null>(null);

  // Fetch initial data client-side
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [utcResponse, nodesResponse] = await Promise.all([
          fetch(`${API_BASE}/api/utc`),
          fetch(`${API_BASE}/api/nodes`),
        ]);

        if (!utcResponse.ok || !nodesResponse.ok) {
          throw new Error("Unable to reach backend API");
        }

        const utc = (await utcResponse.json()) as LiveUtc;
        const nodes = (await nodesResponse.json()) as CountryCardProps[];

        setLive({ utc, nodes });
        setOfficeSnapshot(utc.office ?? null);
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    let cancelled = false;

    const wsBase = API_BASE.replace(/^http/, "ws");
    const socket = new WebSocket(`${wsBase}/ws/live`);

    socket.onopen = () => {
      if (!cancelled) setApiState("live");
    };

    socket.onmessage = (event) => {
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
          if (payload.utc.office) {
            setOfficeSnapshot(payload.utc.office);
          }
          setApiState("live");
        }
      } catch {
        if (!cancelled) setApiState("offline");
      }
    };

    socket.onerror = () => {
      if (!cancelled) setApiState("offline");
    };

    socket.onclose = () => {
      if (!cancelled) setApiState("offline");
    };

    return () => {
      cancelled = true;
      socket.close();
    };
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const nodes = live?.nodes ?? COUNTRIES;
  const [localNodes, setLocalNodes] = useState<typeof COUNTRIES>(() => {
    // Initialize with one clone added by default
    const base = COUNTRIES[0];
    const suffix = String(Date.now()).slice(-3);
    const clone = { ...base, code: `${base.code}_${suffix}` } as any;
    return [...nodes, clone];
  });
  useEffect(() => {
    setLocalNodes(nodes);
  }, [nodes]);

  const [toClone, setToClone] = useState<string>(COUNTRIES[0].code);

  const [compareMode, setCompareMode] = useState(false);
  const [compareSelection, setCompareSelection] = useState<string[]>([]);

  const compareLabelA = compareSelection[0]
    ? (localNodes.find((n) => n.code === compareSelection[0])?.name + " • " + compareSelection[0])
    : null;
  const compareLabelB = compareSelection[1]
    ? (localNodes.find((n) => n.code === compareSelection[1])?.name + " • " + compareSelection[1])
    : null;

  function addClone(code: string) {
    const base = (COUNTRIES.find((c) => c.code === code) || COUNTRIES[0]) as any;
    const suffix = String(Date.now()).slice(-3);
    const clone = { ...base, code: `${base.code}_${suffix}` } as any;
    setLocalNodes((s) => [...s, clone]);
  }
  const utcEpochMs = live?.utc.epoch_ms ?? Date.now();
  const connectionLabel = useMemo(
    () => (apiState === "live" ? "API LIVE" : apiState === "connecting" ? "CONNECTING" : "API OFFLINE"),
    [apiState],
  );

  const officeUtc = live?.utc?.office;
  const officeData = officeUtc ?? officeSnapshot;
  const officeUtcIso = officeData?.iso ?? officeData?.office_utc ?? null;
  const officeBaseMs = officeData?.epoch_ms
    ?? (officeUtcIso ? new Date(officeUtcIso).getTime() : null);
  const utcDiffMs = officeBaseMs !== null ? officeBaseMs - utcEpochMs : null;
  const boardDiffMs = utcDiffMs;
  const officeDelayMs = boardDiffMs !== null ? Math.abs(boardDiffMs) : null;
  const officeDriftMs = boardDiffMs;
  const formatDelta = (ms: number | null) => {
    if (ms === null) return "-- ms";
    const sign = ms >= 0 ? "+" : "-";
    return `${sign}${Math.abs(ms).toFixed(3)} ms`;
  };
  const officeDisplay = officeBaseMs
    ? new Date(officeBaseMs).toISOString().replace("T", " ").replace("Z", " UTC")
    : "OFFICE NTP DATA NOT YET AVAILABLE";

  return (
    <div className="relative min-h-screen overflow-hidden" style={mainStyle}>
      <TopNav />
      <Sidebar />
      <WorldMapBg variant={bgVariant} />

      <main className="relative z-10 lg:ml-[280px] pt-20 px-6 lg:px-10 py-6 min-h-screen">
      <div className="max-w-[1800px] mx-auto">
        {/* Top bar */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="-mt-1 text-left">
              <img
                src={bgVariant === 'brighter' ? '/logo-light.png' : '/logo-dark.png'}
                alt="IIT Tirupati Navavishkār"
                className="mx-0 header-logo-lg"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <h1 className="mt-2 text-lg font-bold tracking-[0.25em] text-glow">NTP-SYNC COMMAND</h1>
              <div className="text-[10px] text-muted-foreground font-mono tracking-[0.3em]">
                GLOBAL TIME COORDINATION CENTER • CLASSIFIED
              </div>
            </div>
          </div>

          <div className="hidden md:flex flex-col items-end gap-3">
            <div className="flex items-center gap-3">
              <StatChip icon={Satellite} label="GNSS LOCK"   value="GPS 11 • GAL 8 • GLO 7" />
              <StatChip icon={Radio}     label="REF CLOCK"   value="Cs-III • Stratum 1" />
              <StatChip icon={Activity}  label="OFFSET RMS"  value="±0.42 ms" />
            </div>
          </div>
        </header>

        {/* Master clock - centered in middle */}
        <section className="min-h-screen flex flex-col items-center justify-center gap-8 mb-12">
          <div className="flex items-start gap-6 w-full px-8 justify-end max-w-7xl">
            <div className="flex flex-col items-end gap-3">
              {
                (() => {
                  const isIittnif = (officeData?.host === "10.26.13.44") || (officeData?.label && String(officeData.label).toLowerCase().includes('iittnif'));
                  return (
                    <button
                      type="button"
                      className={`glass rounded-lg px-5 py-3 text-left min-w-[360px] border ${isIittnif ? 'office-highlight border-cyan-glow/40' : 'border-cyan-glow/20'} shadow-[0_0_24px_rgba(0,229,255,0.08)] hover:border-cyan-glow/40 transition-colors`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-[9px] font-mono tracking-[0.35em] text-muted-foreground">IITTNIF - UTC TIME</div>
                        {isIittnif && <div className="iittnif-badge">IITTNIF</div>}
                      </div>

                      <div className="mt-1 text-lg font-mono font-bold text-cyan-glow">{officeDisplay}</div>

                      <div className="mt-1 text-[10px] font-mono host-line">
                        {officeData
                          ? `${officeData.host ?? "10.26.13.44"}:${officeData.port ?? 123} • master→IITTNIF ${formatDelta(utcDiffMs)}`
                          : "OFFICE NTP DATA NOT YET AVAILABLE"}
                      </div>
                    </button>
                  );
                })()
              }
              <div className="flex flex-row items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBgVariant('darker')}
                  className={`px-3 py-1 rounded text-[12px] font-medium ${bgVariant === 'darker' ? 'bg-cyan-glow/10 border border-cyan-glow' : 'bg-transparent border border-cyan-glow/10'}`}
                >
                  Darker
                </button>
                <button
                  type="button"
                  onClick={() => setBgVariant('brighter')}
                  className={`px-3 py-1 rounded text-[12px] font-medium ${bgVariant === 'brighter' ? 'bg-cyan-glow/10 border border-cyan-glow' : 'bg-transparent border border-cyan-glow/10'}`}
                >
                  Brighter
                </button>
              </div>
            </div>
          </div>

          <AnalogClock epochMs={utcEpochMs} />
          <DigitalUTC epochMs={utcEpochMs} />

          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl">
          <div className="glass rounded-xl border border-cyan-glow/20 px-5 py-4 text-center">
            <div className="text-[10px] font-mono tracking-[0.35em] text-muted-foreground">MASTER → IITTNIF DELAY</div>
            <div className="mt-2 text-2xl font-mono font-bold text-cyan-glow tabular-nums">
              {formatDelta(officeDelayMs)}
            </div>
          </div>
            <div className="glass rounded-xl border border-cyan-glow/20 px-5 py-4 text-center">
              <div className="text-[10px] font-mono tracking-[0.35em] text-muted-foreground">MASTER → IITTNIF DRIFT</div>
              <div className="mt-2 text-2xl font-mono font-bold text-cyan-glow tabular-nums">
                {formatDelta(officeDriftMs)}
              </div>
            </div>
          </section>
        </section>

        {/* Section heading */}
        <div className="flex items-center gap-4 mb-5">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-glow/50 to-transparent" />
          <h2 className="text-xs font-mono tracking-[0.4em] text-cyan-glow text-glow">
            ◆ GLOBAL SYNCHRONIZATION NODES ◆
          </h2>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-glow/50 to-transparent" />
        </div>

        {/* Cards grid */}

        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => {
                setCompareMode((v) => !v);
                setCompareSelection([]);
              }}
              className={`px-3 py-2 rounded ${compareMode ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
            >
              {compareMode ? "Comparing: select 2 cards" : "Compare"}
            </button>

            <div className="flex items-center gap-2">
              <div className="w-44 p-2 bg-background/60 rounded border border-cyan-glow/10 text-sm text-muted-foreground">
                {compareLabelA ?? "Slot A: select a card"}
              </div>
              <div className="w-44 p-2 bg-background/60 rounded border border-cyan-glow/10 text-sm text-muted-foreground">
                {compareLabelB ?? "Slot B: select a card"}
              </div>
            </div>
          </div>
          <div />
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {localNodes.map((c) => (
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
        <footer className="mt-10 flex flex-col md:flex-row items-center justify-between gap-3 text-[10px] font-mono tracking-[0.25em] text-muted-foreground">
          <span>SYS://NTP.GLOBAL.MIL — CHANNEL SECURE</span>
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-online animate-pulse" />
            {connectionLabel} • {nodes.length} / {COUNTRIES.length} • LEAP: {live?.utc.leap ?? "NONE"}
          </span>
          <span>BUILD 24.11 • CRYPTO-SIGNED</span>
        </footer>
      </div>
      </main>
    </div>
  );
}
