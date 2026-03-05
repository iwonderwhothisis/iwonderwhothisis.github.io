import { WebGLShader } from "@/components/ui/web-gl-shader"
import personalLimits from "@/assets/images/personal_limits.png"
import groupView from "@/assets/images/group_view.png"

const SCREENSHOTS = [
  { url: personalLimits, label: "Personal Limits", desc: "Set smart daily time limits for every app." },
  { url: groupView,      label: "Group View",      desc: "See how your group is doing at a glance." },
]

export default function App() {
  return (
    <div className="min-h-screen bg-[#08060f] text-white">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* WebGL background */}
        <div className="absolute inset-0">
          <WebGLShader className="h-full w-full" />
        </div>

        {/* Noise overlay for texture */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
            opacity: 0.4,
          }}
        />

        {/* Hero content */}
        <div className="relative z-10 flex flex-col items-center gap-6 px-4 text-center">
          {/* Available badge */}
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-white/70 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
            </span>
            Coming Soon
          </div>

          <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight sm:text-7xl">
            Not{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #c084fc 0%, #818cf8 50%, #67e8f9 100%)",
              }}
            >
            Addicted
            </span>
          </h1>

          <div className="mt-2 flex flex-col items-center gap-3">
            <p className="text-sm text-white/40">Take Back Your Time</p>
            <button className="text-sm text-white/40 underline underline-offset-4 hover:text-white/70 transition-colors">
              Learn more ↓
            </button>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#08060f] to-transparent" />
      </section>

      {/* ── Screenshots ───────────────────────────────────────────────────── */}
      <section className="bg-[#08060f] px-4 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Every feature you need
            </h2>
            <p className="mt-3 text-white/50">
              Simple, powerful tools for building healthier digital habits.
            </p>
          </div>

          <div className="flex justify-center gap-16">
            {SCREENSHOTS.map(({ url, label, desc }) => (
              <div key={label} className="group flex flex-col items-center gap-4">
                {/* Phone frame */}
                <div
                  className="relative w-48 overflow-hidden rounded-3xl transition-transform duration-500 group-hover:-translate-y-2"
                  style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
                  }}
                >
                  <img
                    src={url}
                    alt={label}
                    className="w-full h-auto"
                    loading="lazy"
                  />
                  {/* Screen glare */}
                  <div
                    className="pointer-events-none absolute inset-0 rounded-3xl"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%)",
                    }}
                  />
                </div>

                {/* Chip */}
                <div className="flex flex-col items-center gap-1 text-center">
                  <span className="rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300">
                    {label}
                  </span>
                  <p className="text-sm text-white/50">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ─────────────────────────────────────────────────────────── */}
      <section className="border-t border-white/5 bg-[#050408] px-4 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            About NotAddicted
          </h2>
          <p className="leading-relaxed text-white/55">
            NotAddicted helps you stay off distracting apps by adding real accountability. Set app limits and join a small group of friends who can see when you hit your limit or request more time. If you want to extend your screen time, you have to ask your group first.
          </p>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 bg-[#050408] px-4 py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-sm text-white/30 sm:flex-row">
          <span className="font-semibold tracking-wide text-white/50">NotAddicted</span>
          <span className="text-xs text-white/30">Launching on iOS</span>
        </div>
      </footer>
    </div>
  )
}
