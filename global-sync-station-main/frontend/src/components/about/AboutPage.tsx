import { useEffect, useState } from "react";
import {
  Satellite,
  Radio,
  Cpu,
  Plane,
  Map,
  Clock,
  Antenna,
  Server,
  Network,
  Monitor,
  Atom,
  Shield,
  Zap,
  Building2,
  Landmark,
  FlaskConical,
  Globe2,
  Activity,
  TrendingUp,
  Microscope,
  CircuitBoard,
  Waves,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { NetworkSyncBg } from "./NetworkSyncBg";
import { Reveal, Stagger, MotionCard, motion, fadeUp } from "./motion";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-mono tracking-[0.35em] text-muted-foreground uppercase">
      {children}
    </div>
  );
}

function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={cn("text-2xl sm:text-3xl font-bold text-glow mt-2", className)}>
      {children}
    </h2>
  );
}

function GlassCard({
  children,
  className,
  glow,
}: {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}) {
  return (
    <Card
      className={cn(
        "glass glass-hover elegant-bright-surface overflow-hidden",
        glow && "about-card-glow",
        className,
      )}
    >
      {children}
    </Card>
  );
}

/* ─── Hero ─── */
function AboutHero({ bright }: { bright: boolean }) {
  return (
    <section className="relative -mx-3 sm:-mx-6 md:-mx-8 lg:-mx-10 mb-16 sm:mb-20 overflow-hidden rounded-2xl sm:rounded-3xl min-h-[420px] sm:min-h-[480px] flex items-center">
      <NetworkSyncBg bright={bright} />
      <div className="relative z-10 w-full px-6 sm:px-10 md:px-14 py-14 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <SectionLabel>IITTNIF Technology Innovation Hub</SectionLabel>
          <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold leading-tight">
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent animate-title-glow">
              About IITTNIF TIH &amp; Precision Time Infrastructure
            </span>
          </h1>
          <p className="mt-5 max-w-3xl text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
            Advancing Positioning, Navigation and Timing research through world-class laboratory
            infrastructure, GPS-disciplined Stratum-1 synchronization, and cyber-physical systems
            innovation at IIT Tirupati — supported by the National Mission on Interdisciplinary
            Cyber-Physical Systems and the Department of Science &amp; Technology, Government of India.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              { icon: Satellite, label: "GNSS & PNT Research" },
              { icon: Clock, label: "Stratum-1 NTP" },
              { icon: FlaskConical, label: "NM-ICPS TIH" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="glass rounded-xl px-4 py-2.5 flex items-center gap-2.5 border border-cyan-glow/20"
              >
                <Icon className="w-4 h-4 text-cyan-glow" />
                <span className="text-xs sm:text-sm font-mono text-cyan-glow">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── About IITTNiF ─── */
function AboutIITTNiF() {
  const pillars = [
    {
      icon: Landmark,
      title: "IIT Tirupati Navavishkar I-Hub Foundation",
      text: "IITTNIF serves as the dedicated Technology Innovation Hub at IIT Tirupati, fostering deep-tech entrepreneurship, translational research, and industry-academia collaboration in cyber-physical systems.",
    },
    {
      icon: Globe2,
      title: "NM-ICPS Program",
      text: "Established under the National Mission on Interdisciplinary Cyber-Physical Systems (NM-ICPS), the hub addresses critical national priorities in autonomous systems, precision timing, and next-generation navigation technologies.",
    },
    {
      icon: Building2,
      title: "DST Government of India",
      text: "Supported by the Department of Science & Technology (DST), Government of India, IITTNiF receives strategic funding and policy alignment to accelerate indigenous R&D and technology commercialization.",
    },
    {
      icon: Microscope,
      title: "Research & Commercialization",
      text: "The mission bridges fundamental research with market-ready solutions — incubating startups, training skilled workforce, and deploying laboratory-grade infrastructure for faculty, students, and industry partners.",
    },
  ];

  return (
    <section className="mb-16 sm:mb-20">
      <Reveal>
        <SectionLabel>Institutional Overview</SectionLabel>
        <SectionTitle>About IITTNIF TIH</SectionTitle>
        <p className="mt-4 max-w-4xl text-sm sm:text-base text-muted-foreground leading-relaxed">
          The IIT Tirupati Navavishkar I-Hub Foundation (IITTNiF) is a Technology Innovation Hub
          catalyzing breakthrough research in Positioning, Navigation and Timing (PNT) and allied
          cyber-physical domains. As part of India&apos;s NM-ICPS ecosystem, IITTNiF combines academic
          excellence with state-of-the-art laboratory facilities to drive innovation from concept to
          deployment.
        </p>
      </Reveal>

      <Stagger className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
        {pillars.map((p, i) => (
          <MotionCard key={p.title} delay={i * 0.08}>
            <GlassCard className="p-6 h-full" glow>
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-glow/20 to-violet-500/20 border border-cyan-glow/30 flex items-center justify-center">
                  <p.icon className="w-6 h-6 text-cyan-glow" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-base sm:text-lg">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.text}</p>
                </div>
              </div>
            </GlassCard>
          </MotionCard>
        ))}
      </Stagger>
    </section>
  );
}

/* ─── PNT Laboratory ─── */
function PNTLaboratory() {
  const [active, setActive] = useState(0);
  const features = [
    {
      icon: Satellite,
      title: "GNSS Research",
      desc: "Multi-constellation signal analysis, interference mitigation, and high-precision positioning algorithms for research and field deployment.",
      tags: ["GPS", "Galileo", "GLONASS"],
    },
    {
      icon: Radio,
      title: "Software Defined Radio",
      desc: "Flexible RF front-ends and real-time signal processing for GNSS reception, spectrum monitoring, and protocol experimentation.",
      tags: ["USRP", "SDR", "RF"],
    },
    {
      icon: Cpu,
      title: "FPGA Development",
      desc: "Hardware-accelerated signal acquisition, correlator design, and low-latency timing pipelines on programmable logic platforms.",
      tags: ["PYNQ", "VHDL", "HDL"],
    },
    {
      icon: Plane,
      title: "Drone Technologies",
      desc: "UAV navigation, autonomous flight control, and sensor fusion leveraging precision timing and GNSS augmentation.",
      tags: ["UAV", "Autonomy", "Fusion"],
    },
    {
      icon: Map,
      title: "UTM Systems",
      desc: "Unmanned Traffic Management research for safe integration of drones into national airspace with coordinated timing.",
      tags: ["UTM", "Airspace", "BVLOS"],
    },
    {
      icon: Clock,
      title: "Timing Infrastructure",
      desc: "GPS-disciplined Stratum-1 NTP servers providing microsecond-level campus synchronization for research and operations.",
      tags: ["NTP", "PPS", "Stratum-1"],
    },
  ];

  return (
    <section className="mb-16 sm:mb-20">
      <Reveal>
        <SectionLabel>PNT Laboratory</SectionLabel>
        <SectionTitle>Research Capabilities</SectionTitle>
        <p className="mt-4 max-w-3xl text-sm text-muted-foreground">
          Interactive research domains within the Positioning, Navigation and Timing laboratory at IIT Tirupati.
        </p>
      </Reveal>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-5">
        <Stagger className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
          {features.map((f, i) => (
            <motion.button
              key={f.title}
              type="button"
              variants={fadeUp}
              onClick={() => setActive(i)}
              className={cn(
                "text-left p-4 rounded-xl border transition-all duration-300 glass glass-hover",
                active === i
                  ? "border-cyan-glow/50 shadow-[0_0_24px_rgba(86,240,255,0.15)] bg-cyan-glow/5"
                  : "border-cyan-glow/15 hover:border-cyan-glow/30",
              )}
            >
              <div className="flex items-center gap-3">
                <f.icon className={cn("w-5 h-5", active === i ? "text-cyan-glow" : "text-muted-foreground")} />
                <span className="font-medium text-sm">{f.title}</span>
              </div>
            </motion.button>
          ))}
        </Stagger>

        <Reveal className="lg:col-span-7" delay={0.15}>
          <GlassCard className="p-6 sm:p-8 h-full min-h-[280px]" glow>
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              {(() => {
                const f = features[active];
                const Icon = f.icon;
                return (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-glow/20 border border-cyan-glow/25 flex items-center justify-center">
                        <Icon className="w-7 h-7 text-cyan-glow" />
                      </div>
                      <h3 className="text-xl font-bold text-glow">{f.title}</h3>
                    </div>
                    <p className="mt-5 text-sm sm:text-base text-muted-foreground leading-relaxed">{f.desc}</p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {f.tags.map((t) => (
                        <span
                          key={t}
                          className="px-3 py-1 rounded-full text-[10px] font-mono tracking-wider border border-cyan-glow/25 text-cyan-glow bg-cyan-glow/5"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </GlassCard>
        </Reveal>
      </div>
    </section>
  );
}

/* ─── Infrastructure Showcase ─── */
function InfrastructureShowcase() {
  const equipment = [
    { name: "USRP B210 SDR", role: "Wideband RF transceiver for real-time GNSS and wireless experimentation", icon: Radio },
    { name: "PYNQ FPGA Board", role: "Programmable SoC platform for hardware-accelerated signal processing", icon: CircuitBoard },
    { name: "GSG-8 GNSS Simulator", role: "Multi-constellation RF signal generation for controlled test scenarios", icon: Satellite },
    { name: "MATLAB", role: "Algorithm development, simulation, and data analysis for PNT research", icon: Activity },
    { name: "Skydel", role: "Advanced GNSS simulation software for scenario modeling and validation", icon: Globe2 },
    { name: "ANSYS HFSS", role: "Electromagnetic simulation for antenna design and RF component analysis", icon: Waves },
  ];

  return (
    <section className="mb-16 sm:mb-20">
      <Reveal>
        <SectionLabel>Laboratory Assets</SectionLabel>
        <SectionTitle>Infrastructure Showcase</SectionTitle>
        <p className="mt-4 max-w-3xl text-sm text-muted-foreground">
          Enterprise-grade equipment enabling reproducible research, validation, and demonstration for visitors and collaborators.
        </p>
      </Reveal>

      <Stagger className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {equipment.map((eq, i) => (
          <MotionCard key={eq.name} delay={i * 0.06}>
            <GlassCard className="p-5 h-full group" glow>
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-glow/15 to-fuchsia-500/10 border border-cyan-glow/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <eq.icon className="w-5 h-5 text-cyan-glow" />
                </div>
                <motion.div
                  className="w-2 h-2 rounded-full bg-online"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                />
              </div>
              <h3 className="mt-4 font-semibold text-foreground">{eq.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{eq.role}</p>
              <div className="mt-4 h-0.5 w-full rounded-full bg-gradient-to-r from-cyan-glow/40 via-violet-400/30 to-transparent about-equip-bar" />
            </GlassCard>
          </MotionCard>
        ))}
      </Stagger>
    </section>
  );
}

/* ─── NTP Architecture Flow ─── */
function NTPArchitecture() {
  const steps = [
    { icon: Satellite, label: "GPS Satellites", sub: "Atomic clock reference in orbit" },
    { icon: Antenna, label: "GPS Antenna", sub: "Roof-mounted GNSS reception" },
    { icon: Server, label: "Stratum-1 NTP Server", sub: "IITTNiF GPS-disciplined master" },
    { icon: Network, label: "Campus Network", sub: "Ethernet distribution backbone" },
    { icon: Monitor, label: "Clients & Systems", sub: "Workstations, labs, IoT devices" },
  ];

  return (
    <section className="mb-16 sm:mb-20">
      <Reveal>
        <SectionLabel>System Architecture</SectionLabel>
        <SectionTitle>NTP Server Architecture</SectionTitle>
        <p className="mt-4 max-w-3xl text-sm text-muted-foreground">
          End-to-end time distribution from satellite atomic references to campus-wide client synchronization.
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <GlassCard className="mt-8 p-6 sm:p-10" glow>
          <div className="flex flex-col items-center gap-0 max-w-md mx-auto lg:max-w-none">
            {steps.map((step, i) => (
              <div key={step.label} className="flex flex-col items-center w-full">
                <motion.div
                  className="w-full max-w-sm"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.5 }}
                >
                  <div className="flex items-center gap-4 p-4 rounded-2xl border border-cyan-glow/25 bg-gradient-to-r from-cyan-glow/5 to-transparent glass">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-cyan-glow/10 border border-cyan-glow/30 flex items-center justify-center">
                      <step.icon className="w-6 h-6 text-cyan-glow" />
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{step.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{step.sub}</div>
                    </div>
                    <motion.div
                      className="ml-auto w-2.5 h-2.5 rounded-full bg-cyan-glow hidden sm:block"
                      animate={{ boxShadow: ["0 0 4px #56f0ff", "0 0 16px #56f0ff", "0 0 4px #56f0ff"] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                    />
                  </div>
                </motion.div>

                {i < steps.length - 1 && (
                  <div className="relative h-10 sm:h-12 w-px my-1">
                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-glow/50 to-cyan-glow/10 w-px left-1/2 -translate-x-1/2" />
                    <motion.div
                      className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-cyan-glow about-sync-pulse"
                      style={{ top: "50%" }}
                      animate={{ y: [-12, 12], opacity: [0, 1, 0] }}
                      transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.4 }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </GlassCard>
      </Reveal>
    </section>
  );
}

/* ─── What is NTP ─── */
function WhatIsNTP() {
  const applications = [
    { icon: TrendingUp, title: "Financial Systems", text: "Microsecond-accurate timestamps for trade ordering, audit trails, and regulatory compliance." },
    { icon: Radio, title: "Telecom Networks", text: "Synchronized base stations and backhaul for 4G/5G TDD coordination and handover." },
    { icon: Shield, title: "Cybersecurity Logs", text: "Correlated event timelines across distributed systems for forensics and incident response." },
    { icon: Zap, title: "Power Grids", text: "Phasor measurement and fault analysis requiring sub-millisecond time alignment." },
    { icon: FlaskConical, title: "Research Infrastructure", text: "Laboratory instruments, data acquisition, and distributed experiments demand common time." },
  ];

  return (
    <section className="mb-16 sm:mb-20">
      <Reveal>
        <SectionLabel>Protocol Overview</SectionLabel>
        <SectionTitle>What is NTP?</SectionTitle>
      </Reveal>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Reveal delay={0.05}>
          <GlassCard className="p-6 sm:p-8 h-full" glow>
            <h3 className="text-lg font-semibold text-cyan-glow">Network Time Protocol</h3>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              The Network Time Protocol (NTP) is an internet protocol designed to synchronize computer
              clocks across packet-switched networks. Operating over UDP port 123, NTP achieves
              millisecond to sub-millisecond accuracy through hierarchical stratum levels, statistical
              filtering, and continuous clock discipline.
            </p>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Why synchronization matters:</strong> Modern
              cyber-physical systems depend on a shared notion of time. Without precise synchronization,
              distributed systems cannot correlate events, coordinate actions, or maintain data integrity
              across networks spanning campuses, cities, and continents.
            </p>
          </GlassCard>
        </Reveal>

        <Stagger className="space-y-3">
          {applications.map((app, i) => (
            <MotionCard key={app.title} delay={i * 0.05}>
              <div className="flex items-start gap-4 p-4 rounded-xl glass border border-cyan-glow/15">
                <app.icon className="w-5 h-5 text-cyan-glow shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-sm">{app.title}</div>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{app.text}</p>
                </div>
              </div>
            </MotionCard>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

/* ─── Stratum Hierarchy ─── */
function StratumHierarchy() {
  const strata = [
    { level: 0, title: "Atomic Clock / GPS", desc: "Primary reference — cesium clocks and GPS constellation", color: "from-violet-500/30 to-fuchsia-500/20" },
    { level: 1, title: "IITTNiF GPS NTP Server", desc: "Campus Stratum-1 master disciplined to GPS", color: "from-cyan-glow/30 to-sky-500/20", highlight: true },
    { level: 2, title: "Regional Servers", desc: "Departmental and building-level time distribution", color: "from-blue-500/20 to-cyan-glow/15" },
    { level: 3, title: "Client Devices", desc: "Workstations, embedded systems, and IoT endpoints", color: "from-slate-500/15 to-cyan-glow/10" },
  ];

  return (
    <section className="mb-16 sm:mb-20">
      <Reveal>
        <SectionLabel>Time Hierarchy</SectionLabel>
        <SectionTitle>Stratum Hierarchy</SectionTitle>
      </Reveal>

      <Stagger className="mt-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {strata.map((s, i) => (
          <MotionCard key={s.level} delay={i * 0.08}>
            <GlassCard
              className={cn(
                "p-5 h-full relative overflow-hidden",
                s.highlight && "ring-1 ring-cyan-glow/40",
              )}
              glow
            >
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-60", s.color)} />
              <div className="relative">
                <div className="text-[10px] font-mono tracking-[0.35em] text-muted-foreground">
                  STRATUM {s.level}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Atom className="w-5 h-5 text-cyan-glow" />
                  <h3 className="font-semibold text-sm sm:text-base">{s.title}</h3>
                </div>
                <p className="mt-3 text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                {i < strata.length - 1 && (
                  <div className="hidden xl:block absolute -right-6 top-1/2 -translate-y-1/2 text-cyan-glow/50 text-xl">
                    →
                  </div>
                )}
              </div>
            </GlassCard>
          </MotionCard>
        ))}
      </Stagger>
    </section>
  );
}

/* ─── Why Our Server Matters ─── */
function WhyOurServer() {
  const metrics = [
    { label: "GPS Disciplined", value: "PPS Locked", icon: Satellite },
    { label: "Stratum Level", value: "Stratum-1", icon: Server },
    { label: "Coverage", value: "Campus Wide", icon: Network },
    { label: "Precision", value: "Sub-ms Timing", icon: Clock },
    { label: "Purpose", value: "Research Grade", icon: FlaskConical },
  ];

  return (
    <section className="mb-16 sm:mb-20">
      <Reveal>
        <SectionLabel>Operational Excellence</SectionLabel>
        <SectionTitle>Why Our Server Matters</SectionTitle>
        <p className="mt-4 max-w-3xl text-sm text-muted-foreground">
          The IITTNiF Stratum-1 NTP infrastructure provides authoritative time for the entire campus research ecosystem.
        </p>
      </Reveal>

      <Stagger className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {metrics.map((m, i) => (
          <MotionCard key={m.label} delay={i * 0.06}>
            <GlassCard className="p-5 text-center h-full" glow>
              <m.icon className="w-6 h-6 text-cyan-glow mx-auto" />
              <div className="mt-3 text-[9px] font-mono tracking-[0.3em] text-muted-foreground uppercase">
                {m.label}
              </div>
              <div className="mt-2 text-lg sm:text-xl font-bold text-cyan-glow font-mono">{m.value}</div>
            </GlassCard>
          </MotionCard>
        ))}
      </Stagger>
    </section>
  );
}

/* ─── Interactive Timeline ─── */
function InteractiveTimeline() {
  const events = [
    { title: "GPS Atomic Clock", desc: "Cesium & rubidium references aboard GNSS satellites", icon: Atom },
    { title: "Satellite Transmission", desc: "L-band RF signals broadcast to Earth receivers", icon: Satellite },
    { title: "IITTNiF Stratum-1 Server", desc: "GPS antenna + disciplined oscillator + NTP daemon", icon: Server },
    { title: "Campus Distribution", desc: "Network switches propagate time across IIT Tirupati", icon: Network },
    { title: "End User Devices", desc: "Clients synchronize for research and operations", icon: Monitor },
  ];

  return (
    <section className="mb-16 sm:mb-20">
      <Reveal>
        <SectionLabel>Signal Propagation</SectionLabel>
        <SectionTitle>Interactive Timeline</SectionTitle>
      </Reveal>

      <Reveal delay={0.1}>
        <GlassCard className="mt-8 p-6 sm:p-10 overflow-x-auto" glow>
          <div className="min-w-[640px] relative">
            <div className="absolute top-[2.75rem] left-8 right-8 h-0.5 bg-gradient-to-r from-violet-500/40 via-cyan-glow/50 to-cyan-glow/20 rounded-full" />
            <motion.div
              className="absolute top-[2.65rem] left-8 h-1 w-8 rounded-full bg-cyan-glow about-timeline-beam"
              animate={{ left: ["2rem", "calc(100% - 4rem)"] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />

            <div className="relative flex justify-between gap-2">
              {events.map((ev, i) => (
                <motion.div
                  key={ev.title}
                  className="flex flex-col items-center text-center flex-1 max-w-[140px]"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                >
                  <motion.div
                    className="w-14 h-14 rounded-2xl glass border border-cyan-glow/30 flex items-center justify-center about-timeline-node"
                    whileHover={{ scale: 1.08 }}
                  >
                    <ev.icon className="w-6 h-6 text-cyan-glow" />
                  </motion.div>
                  <h4 className="mt-4 text-xs sm:text-sm font-semibold leading-tight">{ev.title}</h4>
                  <p className="mt-2 text-[10px] sm:text-xs text-muted-foreground leading-relaxed">{ev.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassCard>
      </Reveal>
    </section>
  );
}

/* ─── Footer ─── */
function AboutFooter() {
  return (
    <Reveal>
      <footer className="mt-8 pt-10 pb-6 border-t border-cyan-glow/15">
        <div className="text-center space-y-3">
          <div className="text-lg sm:text-xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
            IIT Tirupati Navavishkar I-Hub Foundation
          </div>
          <div className="text-sm text-muted-foreground font-mono tracking-wide">
            PNT Laboratory · GPS Disciplined Stratum-1 NTP Infrastructure
          </div>
          <div className="flex flex-wrap justify-center gap-4 pt-4 text-[10px] font-mono tracking-[0.25em] text-muted-foreground/70 uppercase">
            <span>NM-ICPS</span>
            <span className="text-cyan-glow/30">·</span>
            <span>DST Govt. of India</span>
            <span className="text-cyan-glow/30">·</span>
            <span>IIT Tirupati</span>
          </div>
        </div>
      </footer>
    </Reveal>
  );
}

/* ─── Main Page ─── */
export function AboutPageContent() {
  const [bright, setBright] = useState(false);

  useEffect(() => {
    const check = () => {
      const el = document.querySelector("[data-theme]");
      setBright(el?.getAttribute("data-theme") === "brighter");
    };
    check();
    const observer = new MutationObserver(check);
    const el = document.querySelector("[data-theme]");
    if (el) observer.observe(el, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="about-page pb-8">
      <AboutHero bright={bright} />
      <AboutIITTNiF />
      <PNTLaboratory />
      <InfrastructureShowcase />
      <NTPArchitecture />
      <WhatIsNTP />
      <StratumHierarchy />
      <WhyOurServer />
      <InteractiveTimeline />
      <AboutFooter />
    </div>
  );
}
