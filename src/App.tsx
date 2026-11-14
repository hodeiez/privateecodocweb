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
import { useTranslation } from 'react-i18next';

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


function ChatDemo() {
  const { t } = useTranslation();
  const ANSWER = t("chat.answer");
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
        {t("chat.question")}
      </div>
      <p className="mb-3 leading-relaxed" style={{ minHeight: 88 }}>
        {text}
        {run && text.length < ANSWER.length && <Caret />}
      </p>
      <button onClick={ask} className="rounded-lg px-4 py-2 font-medium" style={teal}>
        {run ? t("chat.again") : t("chat.ask")}
      </button>
    </Panel>
  );
}

function FilesDemo() {
  const { t } = useTranslation();
  const mute: CSSProperties = { color: "#64748b" };
  return (
    <Panel>
      <div
        className="mb-3 rounded-lg border-2 border-dashed px-3 py-5 text-center"
        style={{ borderColor: "#94a3b8", ...mute }}
      >
        {t("files.drop")}
      </div>
      <div
        className="mb-3 flex items-center justify-between rounded-lg border px-3 py-2"
        style={{ borderColor: "#e2e8f0" }}
      >
        <span className="font-medium">lease-agreement.pdf</span>
        <span className="text-xs" style={{ color: "#0f766e" }}>
          {t("files.saved")}
        </span>
      </div>
      <div className="mb-2 flex gap-2">
        <div
          className="flex-1 rounded-lg border px-3 py-2"
          style={{ borderColor: "#cbd5e1", ...mute }}
        >
          {t("files.search")}
        </div>
        <span className="rounded-lg px-3 py-2" style={teal}>
          {t("files.find")}
        </span>
      </div>
      <div className="text-xs" style={mute}>
        {t("files.page")} 4
      </div>
      <p className="leading-relaxed">
        {t("files.before")}
        <mark style={{ background: "#fef3c7" }}>{t("files.mark")}</mark> {t("files.after")}
      </p>
    </Panel>
  );
}


function TaskDemo() {
const { t } = useTranslation();
const CHECKS = ["c1", "c2", "c3", "c4"].map((k) => t(`tasks1.${k}`));
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
      <div className="mb-3 font-semibold">{t("tasks.name")}</div>
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
          ? t("tasks.progress", { current: Math.min(done + 1, CHECKS.length), total: CHECKS.length })
          : done
            ? t("tasks.again")
            : t("tasks.run")}
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
  const { t } = useTranslation();
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
           {t(`appearance.themes.${n.toLowerCase()}`)}
          </button>
        ))}
      </div>
      <div
        className="overflow-hidden rounded-xl border"
        style={{ borderColor: "#475569", background: p.main, ...fade }}
      >
        <div className="px-3 py-2 text-xs" style={{ background: p.bar, color: p.barText, ...fade }}>
         {t("tasks1.prompt")}
        </div>
        <div className="flex" style={{ height: 176 }}>
          <div className="w-32 space-y-1 p-2" style={{ background: p.side, ...fade }}>
            {[t("tasks1.prompt"), t("tasks1.analyze"), t("nav.tasks")].map((x, i) => (
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
              {t("themes.summarize")}
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



export default function App() {
  const aboutRef = useRef<HTMLDialogElement>(null);
  const { t } = useTranslation();
  const HEADLINE = t("intro.headline");
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
        aria-label={t("nav.sections")}
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
            <span style={{ opacity: i === active ? 1 : 0, transition: "opacity .2s" }}>{t("nav."+s.id)}</span>
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
          <div className="sm:col-span-2 md:relative ">

            <p className="mb-6 text-xl font-semibold">{APP}</p>
            <h1
              aria-label={HEADLINE}
              className="relative lg:left-30 mb-8 max-w-3xl text-5xl font-bold leading-tight tracking-tight md:text-7xl"
            >
              <span aria-hidden style={{ visibility: "hidden" }}>
                {HEADLINE}
              </span>
              <span aria-hidden className="absolute left-0 top-0">
                {typed}
                <Caret />
              </span>
            </h1>
            <p className="lg:relative lg:left-50 mb-8 max-w-xl text-lg leading-relaxed" style={{ opacity: 0.85 }}>
              {t("intro.body", { app: APP })}
            </p>
            <div className="flex flex-wrap gap-3 px-5 sm:py-7 lg:py-15 md:relative md:left-40 lg:left-80">
              <button
                onClick={() => go(1)}
                className="rounded-lg px-5 py-3 font-medium cursor-pointer"
                style={{ background: "#E6F4F1", color: "#134E4A" }}
              >
               {t("intro.see")}
              </button>
              <button
                onClick={() => go(SECTIONS.length - 1)}
                className="rounded-lg border px-5 py-3 font-medium cursor-pointer"
                style={{ borderColor: "#E6F4F1", background: "transparent", color: "#E6F4F1" }}
              >
                {t("intro.download")}
              </button>
            </div>
          </div>
        </Section>

        <Section s={S.chat}>
          <div>
            <Heading2>{t("chat.title")}</Heading2>
            <Lead>
              {t("chat.lead")}
            </Lead>
          </div>
          <ChatDemo />
        </Section>

        <Section s={S.files}>
          <div>
            <Heading2>{t("files.title")}</Heading2>
            <Lead>
              {t("files.lead")}
            </Lead>
          </div>
          <FilesDemo />
        </Section>

        <Section s={S.tasks}>
          <div>
            <Heading2>{t("tasks.title")}</Heading2>
            <Lead>{t("tasks.lead")}
            </Lead>
          </div>
          <TaskDemo />
        </Section>

        <Section s={S.themes}>
          <div>
            <Heading>{t("themes.title")}</Heading>
            <Lead>
              {t("themes.lead")}
            </Lead>
          </div>
          <ThemeDemo />
        </Section>

        <Section s={S.get}>
          <div>
            <Heading>{t("get.title", { app: APP })}</Heading>
            <Lead>
              {t("get.lead")}
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
      <footer
        className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between gap-4 px-6 py-3 text-xs md:px-20"
        style={blend}
      >
        <span>
          {"Hodei Eceiza Zaldua"} {t("footer.copyright", { year: new Date().getFullYear(), app: APP })}

        </span>
        <a
          onClick={() => aboutRef.current?.showModal()}
          className="cursor-pointer underline-offset-4 hover:underline"
          style={{ color: "#fff" }}
        >
          {t("footer.about")}
        </a>
      </footer>
      <dialog
        ref={aboutRef}
        aria-labelledby="about-title"
        onClick={(e) => {
          // click on the backdrop closes it
          if (e.target === e.currentTarget) e.currentTarget.close();
        }}
        className="m-auto w-[min(92vw,28rem)] rounded-xl border p-0 shadow-2xl backdrop:bg-black/60"
        style={{ borderColor: "#cbd5e1", background: "#fff", color: "#0f172a" }}
      >
        <div className="p-6">
          <h2 id="about-title" className="mb-3 text-2xl font-bold tracking-tight text-stone-950!">
            {t("about.title", { app: APP })}
          </h2>
          <p className="mb-6 leading-relaxed" style={{ opacity: 0.85 }}>
            {t("about.body", { app: APP })}
          </p>
          <div className="flex justify-end">
            <button
              autoFocus
              onClick={() => aboutRef.current?.close()}
              className="cursor-pointer rounded-lg px-4 py-2 font-medium"
              style={teal}
            >
              {t("about.close")}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
