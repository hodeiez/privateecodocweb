import logo from './assets/LogoMasterPriavteEcoDoc.png'
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type UIEvent,
} from "react";
import { Download } from "lucide-react";

const APP = "Private Eco Doc"; // change to your app's name

type SectionDef = { id: string; label: string; bg: string; fg: string };

// One full-screen color field per section. The page is a stack of slides you scroll through.
const S = {
  intro: { id: "intro", label: "Start", bg: "#134E4A", fg: "#E6F4F1" },
  chat: { id: "chat", label: "Chat", bg: "#ECE8EF", fg: "#14232B" },
  files: { id: "files", label: "Files", bg: "#D5EDE9", fg: "#14232B" },
  tasks: { id: "tasks", label: "Saved prompts", bg: "#E3E1F1", fg: "#14232B" },
  themes: { id: "themes", label: "Themes", bg: "#1E293B", fg: "#E2E8F0" },
  get: { id: "get", label: "Download", bg: "#0F766E", fg: "#F0FDFA" },
} satisfies Record<string, SectionDef>;

const SECTIONS: SectionDef[] = Object.values(S);

const reduced = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Types text out like a model streaming tokens
function useTyping(text: string, run: boolean, speed = 24): string {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) {
      setN(0);
      return;
    }
    if (reduced()) {
      setN(text.length);
      return;
    }
    let i = 0;
    setN(0);
    const id = setInterval(() => {
      i += 1;
      setN(i);
      if (i >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [run, text, speed]);
  return text.slice(0, n);
}

const Caret = () => (
  <span
    className="ml-1 inline-block animate-pulse align-middle"
    style={{ width: 4, height: "0.9em", background: "currentColor" }}
  />
);

function Section({ s, children }: { s: SectionDef; children: ReactNode }) {
  return (
    <section
      id={s.id}
      data-section
      className="flex min-h-screen items-center px-6 py-20 md:px-20"
      style={{ background: s.bg, color: s.fg, scrollSnapAlign: "start" }}
    >
      <div className="mx-auto grid w-full max-w-5xl items-center gap-10 md:grid-cols-2">
        {children}
      </div>
    </section>
  );
}

const Heading = ({ children }: { children: ReactNode }) => (
  <h2 className="mb-4 text-4xl font-bold leading-tight tracking-tight md:text-5xl">{children}</h2>
);
const Heading2 = ({ children }: { children: ReactNode }) => (
  <h2 className="mb-4 text-4xl font-bold leading-tight text-slate-500! tracking-tight md:text-5xl">{children}</h2>
);
const Lead = ({ children }: { children: ReactNode }) => (
  <p className="max-w-md text-lg leading-relaxed" style={{ opacity: 0.8 }}>
    {children}
  </p>
);

// App-like panel, matching the real app: white surface, slate border
const Panel = ({ children }: { children: ReactNode }) => (
  <div
    className="rounded-xl border bg-white p-4 text-sm shadow-lg"
    style={{ borderColor: "#cbd5e1", color: "#0f172a" }}
  >
    {children}
  </div>
);

const teal: CSSProperties = { background: "#0f766e", color: "#fff" };

const ANSWER =
  "Your lease needs 60 days' written notice before the end of the term. If you stay past it, it renews month to month.";

function ChatDemo() {
  const [run, setRun] = useState(false);
  const text = useTyping(ANSWER, run);
  const ask = () => {
    setRun(false);
    setTimeout(() => setRun(true), 30);
  };
  return (
    <Panel>
      <div
        className="mb-3 ml-auto w-fit max-w-xs rounded-2xl rounded-br-sm border px-3 py-2"
        style={{ background: "#eef2ff", borderColor: "#e0e7ff", color: "#1e1b4b" }}
      >
        What does my lease say about notice?
      </div>
      <p className="mb-3 leading-relaxed" style={{ minHeight: 88 }}>
        {text}
        {run && text.length < ANSWER.length && <Caret />}
      </p>
      <button onClick={ask} className="rounded-lg px-4 py-2 font-medium" style={teal}>
        {run ? "Ask again" : "Ask"}
      </button>
    </Panel>
  );
}

function FilesDemo() {
  const mute: CSSProperties = { color: "#64748b" };
  return (
    <Panel>
      <div
        className="mb-3 rounded-lg border-2 border-dashed px-3 py-5 text-center"
        style={{ borderColor: "#94a3b8", ...mute }}
      >
        Drop a file here
      </div>
      <div
        className="mb-3 flex items-center justify-between rounded-lg border px-3 py-2"
        style={{ borderColor: "#e2e8f0" }}
      >
        <span className="font-medium">lease-agreement.pdf</span>
        <span className="text-xs" style={{ color: "#0f766e" }}>
          Saved
        </span>
      </div>
      <div className="mb-2 flex gap-2">
        <div
          className="flex-1 rounded-lg border px-3 py-2"
          style={{ borderColor: "#cbd5e1", ...mute }}
        >
          notice
        </div>
        <span className="rounded-lg px-3 py-2" style={teal}>
          Find
        </span>
      </div>
      <div className="text-xs" style={mute}>
        Page 4
      </div>
      <p className="leading-relaxed">
        The tenant must give 60 days' written{" "}
        <mark style={{ background: "#fef3c7" }}>notice</mark> before the end of the term.
      </p>
    </Panel>
  );
}

const CHECKS = [
  "Who are the parties?",
  "How long is the term?",
  "What is the notice period?",
  "Are there penalties for leaving early?",
];

function TaskDemo() {
  const [done, setDone] = useState(0);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setDone((d) => d + 1), reduced() ? 100 : 800);
    return () => clearInterval(id);
  }, [running]);
  useEffect(() => {
    if (done >= CHECKS.length) setRunning(false);
  }, [done]);
  const start = () => {
    setDone(0);
    setRunning(true);
  };
  return (
    <Panel>
      <div className="mb-3 font-semibold">Lease check</div>
      <ul className="mb-4 list-none space-y-2 p-0">
        {CHECKS.map((q, i) => (
          <li key={q} className="flex items-center gap-2">
            <span
              className="inline-flex items-center justify-center rounded-full border text-xs"
              style={{
                width: 20,
                height: 20,
                borderColor: i < done ? "#0f766e" : "#94a3b8",
                background: i < done ? "#0f766e" : "transparent",
                color: "#fff",
              }}
            >
              {i < done ? "✓" : ""}
            </span>
            <span style={{ opacity: i <= done ? 1 : 0.5 }}>{q}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={start}
        disabled={running}
        className="rounded-lg px-4 py-2 font-medium"
        style={{ ...teal, opacity: running ? 0.5 : 1 }}
      >
        {running
          ? `Question ${Math.min(done + 1, CHECKS.length)} of ${CHECKS.length}`
          : done
            ? "Run again"
            : "Run task"}
      </button>
    </Panel>
  );
}

type Palette = {
  bar: string;
  barText: string;
  side: string;
  btn: string;
  active: string;
  btnText: string;
  main: string;
  bubble: string;
  bubbleText: string;
  line: string;
};

const PALETTES: Record<string, Palette> = {
  Teal: { bar: "#0f766e", barText: "#f1f5f9", side: "#f1f5f9", btn: "#115e59", active: "#134e4a", btnText: "#e2e8f0", main: "#e6e3e8", bubble: "#eef2ff", bubbleText: "#1e1b4b", line: "#cbd5e1" },
  Dark: { bar: "#020617", barText: "#e2e8f0", side: "#020617", btn: "#1e293b", active: "#334155", btnText: "#cbd5e1", main: "#1e293b", bubble: "#312e81", bubbleText: "#e0e7ff", line: "#475569" },
  Indigo: { bar: "#4f46e5", barText: "#eef2ff", side: "#e0e7ff", btn: "#4338ca", active: "#312e81", btnText: "#e0e7ff", main: "#eef2ff", bubble: "#c7d2fe", bubbleText: "#1e1b4b", line: "#a5b4fc" },
};

function ThemeDemo() {
  const [name, setName] = useState("Teal");
  const p: Palette = PALETTES[name] ?? PALETTES.Teal;
  const fade: CSSProperties = { transition: "background-color .3s, color .3s" };
  return (
    <div>
      <div className="mb-4 flex gap-2">
        {Object.keys(PALETTES).map((n) => (
          <button
            key={n}
            onClick={() => setName(n)}
            aria-pressed={n === name}
            className="rounded-full border px-4 py-1.5 text-sm"
            style={{
              borderColor: "#94a3b8",
              background: n === name ? "#E2E8F0" : "transparent",
              color: n === name ? "#0f172a" : "#E2E8F0",
            }}
          >
            {n}
          </button>
        ))}
      </div>
      <div
        className="overflow-hidden rounded-xl border"
        style={{ borderColor: "#475569", background: p.main, ...fade }}
      >
        <div className="px-3 py-2 text-xs" style={{ background: p.bar, color: p.barText, ...fade }}>
          Prompt
        </div>
        <div className="flex" style={{ height: 176 }}>
          <div className="w-32 space-y-1 p-2" style={{ background: p.side, ...fade }}>
            {["Prompt", "Analyze file", "Saved prompts"].map((x, i) => (
              <div
                key={x}
                className="rounded px-2 py-1 text-xs"
                style={{ background: i === 0 ? p.active : p.btn, color: p.btnText, ...fade }}
              >
                {x}
              </div>
            ))}
          </div>
          <div className="flex-1 space-y-2 p-3">
            <div
              className="ml-auto w-fit rounded-xl px-2 py-1 text-xs"
              style={{ background: p.bubble, color: p.bubbleText, ...fade }}
            >
              Summarize this file
            </div>
            {["75%", "90%", "60%"].map((w) => (
              <div key={w} className="rounded" style={{ height: 8, width: w, background: p.line, ...fade }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const HEADLINE = "Ask questions about your documents without sending them anywhere.";

export default function App() {
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const typed = useTyping(HEADLINE, true, 38);
  const narrow = typeof window !== "undefined" && window.innerWidth < 768;

  const go = (i: number) => {
    const els = scroller.current?.querySelectorAll<HTMLElement>("[data-section]");
    if (!els || els.length === 0) return;
    els[Math.max(0, Math.min(els.length - 1, i))].scrollIntoView({
      behavior: reduced() ? "auto" : "smooth",
    });
  };

  // Which section is on screen
  useEffect(() => {
    const root = scroller.current;
    if (!root) return;
    const els = Array.from(root.querySelectorAll<HTMLElement>("[data-section]"));
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(els.indexOf(e.target as HTMLElement));
        }),
      { root, threshold: 0.6 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Arrow keys and Page Up/Down move one section
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        go(active + 1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        go(active - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  const onScroll = (e: UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    setProgress(el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight));
  };

  const blend: CSSProperties = { mixBlendMode: "difference", color: "#fff" };

  return (
    <div className="relative w-full" style={{ height: "100vh" }}>
      <div
        className="absolute left-0 top-0 z-20"
        style={{ height: 3, width: `${progress * 100}%`, background: "#fff", mixBlendMode: "difference" }}
      />

      <nav
        aria-label="Sections"
        className="absolute right-4 top-1/2 z-20 flex -translate-y-1/2 flex-col items-end gap-3"
        style={blend}
      >
        {SECTIONS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => go(i)}
            aria-label={s.label}
            aria-current={i === active}
            className="flex items-center gap-2 text-sm"
            style={{ background: "transparent", border: 0, padding: 0, color: "#fff" }}
          >
            <span style={{ opacity: i === active ? 1 : 0, transition: "opacity .2s" }}>{s.label}</span>
            <span
              className="block rounded-full"
              style={{
                width: i === active ? 12 : 8,
                height: i === active ? 12 : 8,
                background: "#fff",
                opacity: i === active ? 1 : 0.5,
                transition: "all .2s",
              }}
            />
          </button>
        ))}
      </nav>

      <div
        ref={scroller}
        onScroll={onScroll}
        className="h-full overflow-y-auto"
        style={{ scrollSnapType: narrow ? "y proximity" : "y mandatory" }}
      >
        <Section s={S.intro}>
          <img
            src={logo}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 m-auto h-3/4 w-3/4 object-contain opacity-10 select-none"
          />
          <div className="md:col-span-2">
            <p className="mb-6 text-xl font-semibold">{APP}</p>
            <h1
              aria-label={HEADLINE}
              className="relative mb-8 max-w-3xl text-5xl font-bold leading-tight tracking-tight md:text-7xl"
            >
              <span aria-hidden style={{ visibility: "hidden" }}>
                {HEADLINE}
              </span>
              <span aria-hidden className="absolute left-0 top-0">
                {typed}
                <Caret />
              </span>
            </h1>
            <p className="mb-8 max-w-xl text-lg leading-relaxed" style={{ opacity: 0.85 }}>
              {APP} runs open models on your own computer. Chat, analyze files and rerun saved
              prompts with no account and no cloud.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => go(1)}
                className="rounded-lg px-5 py-3 font-medium"
                style={{ background: "#E6F4F1", color: "#134E4A" }}
              >
                See how it works
              </button>
              <button
                onClick={() => go(SECTIONS.length - 1)}
                className="rounded-lg border px-5 py-3 font-medium"
                style={{ borderColor: "#E6F4F1", background: "transparent", color: "#E6F4F1" }}
              >
                Download
              </button>
            </div>
          </div>
        </Section>

        <Section s={S.chat}>
          <div>
            <Heading2>Chat in two speeds</Heading2>
            <Lead>
              Concise mode answers in a few sentences. Deep mode shows its thinking while it works,
              so you can see how it got there.
            </Lead>
          </div>
          <ChatDemo />
        </Section>

        <Section s={S.files}>
          <div>
            <Heading2>Drop a file, get a brief</Heading2>
            <Lead>
              PDF, Word, Excel, code, CSV and JSON. Save it to your library, ask follow-up
              questions, or search for exact words and see where each match is.
            </Lead>
          </div>
          <FilesDemo />
        </Section>

        <Section s={S.tasks}>
          <div>
            <Heading2>Write a prompt once, rerun it on any document</Heading2>
            <Lead>
              Put one question on each line, choose the documents, and run the whole checklist in
              one click.
            </Lead>
          </div>
          <TaskDemo />
        </Section>

        <Section s={S.themes}>
          <div>
            <Heading>Make it yours</Heading>
            <Lead>
              Pick a theme and everything follows: sidebar, buttons, chat and the drop zone. The
              app also speaks 16 languages.
            </Lead>
          </div>
          <ThemeDemo />
        </Section>

        <Section s={S.get}>
          <div>
            <Heading>Download {APP}</Heading>
            <Lead>
              On first launch the app checks for Ollama and helps you download the models. After
              that it works offline.
            </Lead>
          </div>
          <div className="space-y-3">
            {["Windows", "macOS", "Linux"].map((os) => (
              <a
                key={os}
                href="#"
                className="flex items-center justify-between rounded-lg border px-5 py-4 text-lg font-medium"
                style={{ borderColor: "rgba(240,253,250,.45)", color: "#F0FDFA" }}
              >
                {os}
                <Download size={20} />
              </a>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
