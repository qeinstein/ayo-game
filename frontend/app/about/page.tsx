import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, Cpu, Layers, GitBranch, TriangleAlert, Boxes, Bot } from 'lucide-react';

export const metadata: Metadata = {
  title: 'How Ayo is built — Engineering notes',
  description:
    'The architecture, concurrency model, scalability and engineering trade-offs behind the Ayo game service.',
};

function Tier({ label, title, lines, tone }: { label: string; title: string; lines: string[]; tone: string }) {
  return (
    <div className="card p-5">
      <span className="text-[10px] font-medium uppercase tracking-[0.2em]" style={{ color: tone }}>
        {label}
      </span>
      <h3 className="mt-1 text-sm font-semibold text-slate-900">{title}</h3>
      <ul className="mt-2 space-y-1 text-[12.5px] text-slate-500">
        {lines.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
    </div>
  );
}

function Card({
  icon, title, children,
}: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="card p-6">
      <div className="mb-3 flex items-center gap-2.5">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-wood-brass/25 bg-wood-brass/10 text-wood-brass">
          {icon}
        </span>
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      </div>
      <div className="space-y-3 text-[13.5px] leading-relaxed text-slate-500">{children}</div>
    </div>
  );
}

const Code = ({ children }: { children: React.ReactNode }) => (
  <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[12px] text-wood-brass">{children}</code>
);

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b border-line/70 bg-ink/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3.5 sm:px-6">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" /> Back to the board
          </Link>
          <span className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Engineering notes</span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        {/* Hero */}
        <div className="max-w-2xl animate-slide-up">
          <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-wood-brass">Under the board</span>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            How it&apos;s built
          </h1>
          <p className="mt-4 text-[15px] leading-relaxed text-slate-500">
            Ayo is a full-stack game service: a <span className="text-slate-700">Spring Boot 3 / Java 17</span>{' '}
            REST backend that runs the authentic rules and a minimax AI, and this <span className="text-slate-700">Next.js</span>{' '}
            client with a real-time 3D board. Here is what powers it — and where it would bend under scale.
          </p>
        </div>

        {/* Architecture diagram */}
        <section className="mt-12">
          <h2 className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">Architecture</h2>
          <div className="grid gap-3 md:grid-cols-3">
            <Tier
              label="Client tier"
              title="Next.js 14 + three.js"
              lines={['3D carved board (R3F)', 'Local fallback engine', 'REST over JSON']}
              tone="#b45309"
            />
            <Tier
              label="Application tier"
              title="Spring Boot 3 · Java 17"
              lines={['GameController (REST)', 'GameService (synchronized)', 'AyoLogic + Minimax AI']}
              tone="#0d9488"
            />
            <Tier
              label="Data tier"
              title="In-memory, per JVM"
              lines={['ConcurrentHashMap', '⟨id → AyoGameSession⟩', 'No external store']}
              tone="#d97706"
            />
          </div>
          <div className="mt-3 flex items-center justify-center gap-3 text-[11px] text-slate-400">
            <span>Vercel</span>
            <span className="h-px w-10 bg-line" />
            <span>HTTPS · CORS</span>
            <span className="h-px w-10 bg-line" />
            <span>Render (Docker, JRE 17)</span>
          </div>
        </section>

        {/* Cards */}
        <section className="mt-12 grid gap-5 md:grid-cols-2">
          <Card icon={<Boxes className="h-4 w-4" />} title="What was built">
            <p>
              A stateful, multi-session game server enforcing the full ruleset: counter-clockwise sowing, the
              12-plus-seed full-lap skip, chain captures, the anti-starvation feeding rule, grand-slam disallowance, and
              the 25-seed win.
            </p>
            <p>
              A single <Code>AyoLogicService</Code> holds the stateless rules engine; <Code>AyoAiService</Code> plays via{' '}
              <span className="text-slate-700">minimax with alpha-beta pruning to depth 4</span>. The client mirrors the
              rules in a fallback engine so a match keeps running even if the backend is asleep.
            </p>
          </Card>

          <Card icon={<Cpu className="h-4 w-4" />} title="Concurrency model">
            <p>
              Sessions live in a <Code>ConcurrentHashMap&lt;String, AyoGameSession&gt;</Code> — lock-free reads for{' '}
              <Code>GET</Code>, and thread-safe creation of independent games with no cross-session contention.
            </p>
            <p>
              Every mutation runs through a <Code>synchronized makeMove()</Code>, so
              <span className="text-slate-700"> sow → capture → score → turn-flip → AI reply</span> commits as one
              atomic transaction. In VS-AI mode the bot&apos;s reply is computed inside the same lock, so a human move and
              its answer are indivisible — no interleaving, no phantom state.
            </p>
          </Card>

          <Card icon={<Layers className="h-4 w-4" />} title="How it scales">
            <p>
              Reads scale freely; the write path is the ceiling. The lock guards the whole <Code>GameService</Code>{' '}
              singleton, so <span className="text-slate-700">every move across every game serializes</span> through one
              monitor. Fine for classroom load, a bottleneck at fleet scale.
            </p>
            <p>
              The path forward: a per-session <Code>ReentrantLock</Code> stored beside each game (independent games run in
              parallel), and — since state is in-memory per JVM — a shared store (Redis) plus sticky routing to scale out
              horizontally instead of up.
            </p>
          </Card>

          <Card icon={<TriangleAlert className="h-4 w-4" />} title="Problems encountered">
            <p>
              The subtle rules bit hardest: getting <span className="text-slate-700">grand-slam</span> and{' '}
              <span className="text-slate-700">anti-starvation feeding</span> to agree with the capture walk took the
              most test iterations.
            </p>
            <ul className="space-y-1.5">
              <li className="flex gap-2"><span className="text-wood-brass">·</span> Preventing race conditions and lost updates under concurrent HTTP load.</li>
              <li className="flex gap-2"><span className="text-wood-brass">·</span> Keeping a browser fallback engine byte-for-byte faithful to the server.</li>
              <li className="flex gap-2"><span className="text-wood-brass">·</span> A <Code>@Scheduled</Code> self-ping to keep the free-tier container warm.</li>
            </ul>
          </Card>
        </section>

        {/* AI callout */}
        <section className="mt-5">
          <div className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-jade/25 bg-jade/10 text-jade">
              <Bot className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-slate-900">The AI, briefly</h3>
              <p className="mt-1 text-[13px] leading-relaxed text-slate-500">
                A depth-4 minimax with alpha-beta pruning, scoring positions by{' '}
                <Code>100 · (capturedₐᵢ − capturedₒₚₚ) + 5 · (on-boardₐᵢ − on-boardₒₚₚ)</Code> — it values banked seeds
                twenty times more than seeds still in play.
              </p>
            </div>
            <Link
              href="/"
              className="shrink-0 rounded-lg bg-wood-brass px-4 py-2 text-center text-[13px] font-semibold text-white transition-colors hover:bg-wood-brassHover"
            >
              Play a match
            </Link>
          </div>
        </section>

        <p className="mt-10 flex items-center gap-2 text-[11px] text-slate-400">
          <GitBranch className="h-3.5 w-3.5" /> Detailed rules, API contract and tests live in the repository README.
        </p>
      </main>
    </div>
  );
}
