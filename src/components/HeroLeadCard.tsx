"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import {
  ChatCircleDots,
  CircleNotch,
  PaperPlaneTilt,
  X,
} from "@phosphor-icons/react";
import { brand, contact, hero } from "@/data/site-copy";
import { btnInverse } from "@/components/buttons";
import { GoogleSchedulingButton } from "@/components/GoogleSchedulingButton";
import { mediaUrl } from "@/lib/media";

type Status = "idle" | "sending" | "sent" | "error";
type Step = "name" | "email" | "phone" | "note" | "done";

type ChatMsg = {
  id: string;
  from: "agent" | "user";
  text: string;
};

type ChatAgent = {
  name: string;
  initials: string;
  photo: string;
};

const AGENTS: ChatAgent[] = [
  { name: "Alex", initials: "AX", photo: mediaUrl("/images/agents/male.png") },
  { name: "Jordan", initials: "JD", photo: mediaUrl("/images/agents/male.png") },
  { name: "Sam", initials: "SM", photo: mediaUrl("/images/agents/male.png") },
  { name: "Chris", initials: "CH", photo: mediaUrl("/images/agents/male.png") },
  { name: "Mia", initials: "MA", photo: mediaUrl("/images/agents/female.png") },
  { name: "Sofia", initials: "SF", photo: mediaUrl("/images/agents/female.png") },
  { name: "Emma", initials: "EM", photo: mediaUrl("/images/agents/female.png") },
  { name: "Olivia", initials: "OL", photo: mediaUrl("/images/agents/female.png") },
];

const STEPS: Step[] = ["name", "email", "phone", "note"];

const CHAT_DING_SRC = "/sounds/apple_ding.mp3";
/** Soft enough not to jump-scare; still audible over page ambience. */
const CHAT_DING_VOLUME = 0.28;
let chatDing: HTMLAudioElement | null = null;

function getChatDing(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (!chatDing) {
    chatDing = new Audio(CHAT_DING_SRC);
    chatDing.preload = "auto";
    chatDing.volume = CHAT_DING_VOLUME;
  }
  return chatDing;
}

/**
 * Unlock autoplay (must run inside a user gesture).
 * When `playDing` is true, leaves the ding audible as the first notification.
 */
async function unlockChatAudio(playDing = false): Promise<boolean> {
  const audio = getChatDing();
  if (!audio) return false;
  try {
    audio.currentTime = 0;
    audio.volume = CHAT_DING_VOLUME;
    await audio.play();
    if (!playDing) {
      audio.pause();
      audio.currentTime = 0;
    }
    return true;
  } catch {
    return false;
  }
}

/** Apple ding on every new agent bubble. Returns false if autoplay blocked. */
async function playChatSound(): Promise<boolean> {
  try {
    // Reuse the unlocked element — Safari often blocks brand-new Audio() nodes
    const audio = getChatDing();
    if (!audio) return false;
    audio.pause();
    audio.currentTime = 0;
    audio.volume = CHAT_DING_VOLUME;
    await audio.play();
    return true;
  } catch {
    return false;
  }
}

function pickAgent(): ChatAgent {
  return AGENTS[Math.floor(Math.random() * AGENTS.length)]!;
}

function withAgent(template: string, agentName: string) {
  return template.replaceAll("{agent}", agentName);
}

function agentPrompt(step: Step, name: string): string {
  const c = hero.lead.chat;
  if (step === "name") return c.askName;
  if (step === "email")
    return c.askEmail.replace("{name}", name.split(" ")[0] || name);
  if (step === "phone") return c.askPhone;
  return c.askNote;
}

function AgentAvatar({
  agent,
  size,
}: {
  agent: ChatAgent;
  size: "sm" | "lg";
}) {
  const px = size === "lg" ? 44 : 28;
  const wrap =
    size === "lg"
      ? "relative inline-block h-11 w-11 shrink-0 overflow-hidden rounded-full bg-fog ring-1 ring-rule"
      : "relative mb-0.5 inline-block h-7 w-7 shrink-0 overflow-hidden rounded-full bg-fog ring-1 ring-rule";

  return (
    <span className={wrap} aria-hidden>
      <span className="absolute inset-0 z-0 flex items-center justify-center text-[10px] font-medium text-moss">
        {agent.initials}
      </span>
      {/* Plain img avoids next/image fill quirks in tiny circular crops */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={agent.photo}
        alt=""
        width={px}
        height={px}
        className="relative z-[1] h-full w-full rounded-full object-cover"
        draggable={false}
      />
    </span>
  );
}

export function HeroLeadCard() {
  const copy = hero.lead;
  const chat = copy.chat;

  const [open, setOpen] = useState(false);
  /** Teaser bubbles beside FAB without opening the panel */
  const [preview, setPreview] = useState(false);
  const [started, setStarted] = useState(false);
  const [agent] = useState(() => pickAgent());
  const [step, setStep] = useState<Step>("name");
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [answers, setAnswers] = useState({
    name: "",
    email: "",
    phone: "",
    note: "",
  });
  const [messages, setMessages] = useState<ChatMsg[]>([]);

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const msgId = useRef(0);
  const heardIds = useRef(new Set<string>());
  const ringingIds = useRef(new Set<string>());
  const messagesRef = useRef(messages);
  messagesRef.current = messages;
  const [audioReady, setAudioReady] = useState(false);

  const live = open || preview;

  function pushMsg(from: ChatMsg["from"], text: string) {
    msgId.current += 1;
    setMessages((prev) => [
      ...prev,
      { id: `${from}-${msgId.current}`, from, text },
    ]);
  }

  // Tease with bubbles on all viewports — never auto-open the panel.
  useEffect(() => {
    const id = window.setTimeout(() => setPreview(true), 1800);
    return () => window.clearTimeout(id);
  }, []);

  // Lock page scroll while the mobile ~70% chat sheet is open
  useEffect(() => {
    if (!open) return;
    const mq = window.matchMedia("(max-width: 639px)");
    if (!mq.matches) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Unlock audio on first gesture; play a ding in-gesture if bubbles already showed
  useEffect(() => {
    const unlock = () => {
      const msgs = messagesRef.current;
      const needsDing = msgs.some(
        (m) => m.from === "agent" && !heardIds.current.has(m.id),
      );
      void unlockChatAudio(needsDing).then((ok) => {
        if (!ok) return;
        if (needsDing) {
          // Mark the oldest unheard agent bubble as covered by this gesture ding
          const first = msgs.find(
            (m) => m.from === "agent" && !heardIds.current.has(m.id),
          );
          if (first) heardIds.current.add(first.id);
        }
        ringingIds.current.clear();
        setAudioReady(true);
      });
    };
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  // Chime when each new agent bubble appears (panel or mobile teaser)
  useEffect(() => {
    if (!live) return;

    const pending = messages.filter(
      (m) =>
        m.from === "agent" &&
        !heardIds.current.has(m.id) &&
        !ringingIds.current.has(m.id),
    );
    if (pending.length === 0) return;

    const timers: number[] = [];
    pending.forEach((m, i) => {
      ringingIds.current.add(m.id);
      // Stagger only when flushing several missed dings after a late unlock
      const stagger = pending.length > 1 && audioReady ? i * 350 : 0;
      timers.push(
        window.setTimeout(() => {
          void playChatSound().then((ok) => {
            ringingIds.current.delete(m.id);
            if (ok) {
              heardIds.current.add(m.id);
              setAudioReady(true);
            }
          });
        }, stagger),
      );
    });

    return () => {
      for (const t of timers) window.clearTimeout(t);
      // Allow retry if we cancelled mid-flight (e.g. Strict Mode)
      for (const m of pending) ringingIds.current.delete(m.id);
    };
  }, [messages, live, audioReady]);

  // Initial greeting (+ city) — when preview starts or panel opens
  useEffect(() => {
    if (!live || started) return;

    let cancelled = false;
    const timers: number[] = [];
    const abort = new AbortController();

    function wait(ms: number) {
      return new Promise<void>((resolve) => {
        timers.push(window.setTimeout(resolve, ms));
      });
    }

    async function start() {
      setTyping(true);
      let city: string | null = null;
      try {
        // Cap geo so a slow/hanging lookup never blocks the chat
        const geoTimer = window.setTimeout(() => abort.abort(), 2500);
        timers.push(geoTimer);
        const res = await fetch("/api/geo", { signal: abort.signal });
        window.clearTimeout(geoTimer);
        if (res.ok) {
          const data = (await res.json()) as { city?: string | null };
          city = data.city?.trim() || null;
        }
      } catch {
        // Fall back to generic greeting
      }
      if (cancelled) return;

      const greeting = withAgent(
        city
          ? chat.greetingWithCity.replaceAll("{city}", city)
          : chat.greeting,
        agent.name,
      );
      const cityPitch = city
        ? chat.greetingCityPitch.replaceAll("{city}", city)
        : null;

      const sequence = [
        greeting,
        ...(cityPitch ? [cityPitch] : []),
        agentPrompt("name", ""),
      ];

      for (let i = 0; i < sequence.length; i++) {
        if (cancelled) return;
        setTyping(true);
        // Longer typing beat so each bubble feels deliberate
        await wait(i === 0 ? 1600 : 2400);
        if (cancelled) return;
        pushMsg("agent", sequence[i]!);
      }
      if (cancelled) return;
      setTyping(false);
      // Mark complete only after messages land (avoids Strict Mode cancel stick)
      setStarted(true);
    }

    void start();
    return () => {
      cancelled = true;
      abort.abort();
      timers.forEach((id) => window.clearTimeout(id));
      setTyping(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, started]);

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing, status, open]);

  useEffect(() => {
    if (!open) return;
    if (!typing && step !== "done" && status !== "sent") {
      if (step === "note") textareaRef.current?.focus();
      else inputRef.current?.focus();
    }
  }, [typing, step, status, open]);

  async function submitLead(nextAnswers: typeof answers) {
    setStatus("sending");
    try {
      const note =
        nextAnswers.note.trim() ||
        "Please have an agent contact me (hero chat).";
      const phone = nextAnswers.phone.trim()
        ? `\n\nPhone: ${nextAnswers.phone.trim()}`
        : "";

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nextAnswers.name.trim(),
          email: nextAnswers.email.trim(),
          company: "",
          budget: "Hero chat callback",
          message: `${note}${phone}`,
        }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("sent");
      setTyping(true);
      window.setTimeout(() => {
        pushMsg("agent", chat.closing);
        setTyping(false);
        setStep("done");
      }, 1800);
    } catch {
      setStatus("error");
      setTyping(false);
    }
  }

  function advance(value: string, skipped = false) {
    if (typing || status === "sending") return;

    const trimmed = value.trim();
    if (!skipped && !trimmed && step !== "phone" && step !== "note") return;

    const display =
      skipped || !trimmed
        ? step === "phone"
          ? chat.skipPhoneLabel
          : chat.skipNoteLabel
        : trimmed;

    pushMsg("user", display);

    const nextAnswers = {
      ...answers,
      [step]: skipped ? "" : trimmed,
    };
    setAnswers(nextAnswers);
    setDraft("");

    const idx = STEPS.indexOf(step as (typeof STEPS)[number]);
    const nextStep = STEPS[idx + 1];

    if (!nextStep) {
      void submitLead(nextAnswers);
      return;
    }

    setTyping(true);
    window.setTimeout(() => {
      pushMsg("agent", agentPrompt(nextStep, nextAnswers.name));
      setStep(nextStep);
      setTyping(false);
    }, 1800);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (step === "phone" || step === "note") {
      advance(draft, !draft.trim());
      return;
    }
    advance(draft);
  }

  const canSend =
    step === "phone" || step === "note" ? true : draft.trim().length > 0;

  const inputType =
    step === "email" ? "email" : step === "phone" ? "tel" : "text";

  const placeholder =
    step === "name"
      ? chat.placeholderName
      : step === "email"
        ? chat.placeholderEmail
        : step === "phone"
          ? chat.placeholderPhone
          : chat.placeholderNote;

  return (
    <>
      {/* Backdrop — mobile modal only */}
      <button
        type="button"
        aria-label="Close chat"
        className={`fixed inset-0 z-[65] bg-[rgba(18,35,20,0.55)] transition-opacity duration-300 sm:hidden ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
        tabIndex={open ? 0 : -1}
        aria-hidden={!open}
      />

      {/* Panel: ~70% sheet on mobile, floating card on desktop */}
      <div
        role="dialog"
        aria-modal={open ? "true" : undefined}
        aria-label={`Chat with ${agent.name}`}
        className={`fixed z-[70] flex flex-col overflow-hidden bg-white text-ink transition-all duration-300 ease-out ${
          open
            ? "pointer-events-auto translate-y-0 opacity-100 max-sm:scale-100 sm:translate-y-0 sm:scale-100"
            : "pointer-events-none translate-y-full opacity-0 max-sm:scale-100 sm:translate-y-3 sm:scale-95"
        } inset-x-0 bottom-0 h-[70dvh] max-h-[70dvh] rounded-t-[24px] shadow-form-lift ring-1 ring-black/5 sm:inset-auto sm:bottom-24 sm:right-6 sm:h-[560px] sm:max-h-none sm:w-[min(100vw-1.5rem,380px)] sm:origin-bottom-right sm:rounded-[24px]`}
        aria-hidden={!open}
      >
        {/* Chat header — live agent */}
        <div className="flex items-center gap-3 border-b border-rule bg-paper px-4 py-3.5 sm:px-5">
          <div className="relative h-11 w-11 shrink-0">
            <AgentAvatar agent={agent} size="lg" />
            <span
              className="absolute bottom-0 right-0 z-10 h-3 w-3 rounded-full border-2 border-paper bg-[#32d200]"
              aria-hidden
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-medium text-ink">
              {agent.name}
            </p>
            <p className="flex items-center gap-1.5 text-sm text-leaf">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-leaf opacity-40" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-leaf" />
              </span>
              {chat.statusOnline}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-white hover:text-ink"
            aria-label="Close chat"
          >
            <X size={18} weight="bold" />
          </button>
        </div>

        {/* Messages */}
        <div
          ref={listRef}
          className="flex flex-1 flex-col gap-3 overflow-y-auto bg-white px-4 py-5 sm:px-5"
          aria-live="polite"
        >
          {messages.map((m) =>
            m.from === "agent" ? (
              <div key={m.id} className="flex max-w-[88%] items-end gap-2">
                <AgentAvatar agent={agent} size="sm" />
                <div className="rounded-2xl rounded-bl-md bg-paper px-3.5 py-2.5 text-[15px] leading-snug text-body">
                  {m.text}
                </div>
              </div>
            ) : (
              <div
                key={m.id}
                className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-ink px-3.5 py-2.5 text-[15px] leading-snug text-white"
              >
                {m.text}
              </div>
            ),
          )}

          {typing && (
            <div className="flex max-w-[88%] items-end gap-2">
              <AgentAvatar agent={agent} size="sm" />
              <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md bg-paper px-3.5 py-3">
                <span className="h-1.5 w-1.5 animate-chat-dot rounded-full bg-muted" />
                <span className="h-1.5 w-1.5 animate-chat-dot rounded-full bg-muted [animation-delay:180ms]" />
                <span className="h-1.5 w-1.5 animate-chat-dot rounded-full bg-muted [animation-delay:360ms]" />
              </div>
            </div>
          )}

          {status === "error" && (
            <p className="text-sm text-red-600">
              Something went wrong. Try again, or email {brand.email}.
            </p>
          )}

          {step === "done" && status === "sent" && (
            <div className="mt-2 rounded-2xl border border-rule bg-paper p-4">
              <p className="text-sm text-body">{chat.schedulePrompt}</p>
              <div className="mt-3">
                <GoogleSchedulingButton
                  label={contact.bookingLabel}
                  color="#273f2b"
                />
              </div>
            </div>
          )}
        </div>

        {/* Composer */}
        {step !== "done" && status !== "sent" && (
          <form
            onSubmit={handleSubmit}
            className="border-t border-rule bg-white px-3 py-3 sm:px-4"
          >
            <div className="flex items-end gap-2">
              {step === "note" ? (
                <textarea
                  ref={textareaRef}
                  rows={2}
                  value={draft}
                  disabled={typing || status === "sending"}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  placeholder={placeholder}
                  className="max-h-24 min-h-[48px] flex-1 resize-none rounded-2xl border border-input-edge bg-paper px-4 py-3 text-base text-ink placeholder:text-muted outline-none transition-colors focus:border-leaf disabled:opacity-60"
                />
              ) : (
                <input
                  ref={inputRef}
                  type={inputType}
                  value={draft}
                  disabled={typing || status === "sending"}
                  onChange={(e) => setDraft(e.target.value)}
                  autoComplete={
                    step === "name"
                      ? "name"
                      : step === "email"
                        ? "email"
                        : step === "phone"
                          ? "tel"
                          : "off"
                  }
                  placeholder={placeholder}
                  className="h-12 flex-1 rounded-full border border-input-edge bg-paper px-4 text-base text-ink placeholder:text-muted outline-none transition-colors focus:border-leaf disabled:opacity-60"
                />
              )}

              {(step === "phone" || step === "note") && !draft.trim() ? (
                <button
                  type="submit"
                  disabled={typing || status === "sending"}
                  className="h-12 shrink-0 rounded-full border border-rule px-4 text-sm font-medium text-ink transition-colors hover:bg-paper disabled:opacity-60"
                >
                  {chat.skip}
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!canSend || typing || status === "sending"}
                  className={`${btnInverse} !h-12 !w-12 !shrink-0 !rounded-full !px-0 disabled:opacity-60`}
                  aria-label={
                    step === "note" ||
                    STEPS.indexOf(step) === STEPS.length - 1
                      ? chat.send
                      : chat.next
                  }
                >
                  {status === "sending" ? (
                    <CircleNotch size={18} className="animate-spin" />
                  ) : (
                    <PaperPlaneTilt size={18} weight="fill" />
                  )}
                </button>
              )}
            </div>
            <p className="mt-2 px-1 text-center text-xs text-muted">
              {copy.trust}
            </p>
          </form>
        )}
      </div>

      {/* Teaser bubbles — notification stack beside FAB (closed only) */}
      {!open && (
        <div
          className="pointer-events-none fixed bottom-[5.75rem] right-5 z-[61] flex w-[min(16.5rem,calc(100vw-5.5rem))] flex-col items-end gap-2 sm:bottom-[6.5rem] sm:right-6"
          aria-live="polite"
          aria-atomic="false"
        >
          {messages
            .filter((m) => m.from === "agent")
            .slice(-2)
            .map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setOpen(true)}
                className="pointer-events-auto max-w-full text-left transition-transform active:scale-[0.98]"
              >
                <span className="sr-only">Open chat: </span>
                <span className="block rounded-2xl rounded-br-md bg-white px-3.5 py-2.5 text-[13px] leading-snug text-body shadow-[0_8px_28px_rgba(18,35,20,0.18)] ring-1 ring-black/5">
                  {m.text}
                </span>
              </button>
            ))}
          {typing && messages.filter((m) => m.from === "agent").length === 0 && (
            <div className="pointer-events-none flex items-center gap-1.5 rounded-2xl rounded-br-md bg-white px-3.5 py-3 shadow-[0_8px_28px_rgba(18,35,20,0.18)] ring-1 ring-black/5">
              <span className="h-1.5 w-1.5 animate-chat-dot rounded-full bg-muted" />
              <span className="h-1.5 w-1.5 animate-chat-dot rounded-full bg-muted [animation-delay:180ms]" />
              <span className="h-1.5 w-1.5 animate-chat-dot rounded-full bg-muted [animation-delay:360ms]" />
            </div>
          )}
        </div>
      )}

      {/* Launcher — hidden on mobile while sheet is open */}
      <button
        type="button"
        onClick={() => {
          const msgs = messagesRef.current;
          const needsDing = msgs.some(
            (m) => m.from === "agent" && !heardIds.current.has(m.id),
          );
          void unlockChatAudio(needsDing).then((ok) => {
            if (!ok) return;
            if (needsDing) {
              const first = msgs.find(
                (m) => m.from === "agent" && !heardIds.current.has(m.id),
              );
              if (first) heardIds.current.add(first.id);
            }
            ringingIds.current.clear();
            setAudioReady(true);
          });
          setOpen((v) => !v);
        }}
        className={`pointer-events-auto fixed bottom-5 right-5 z-[60] inline-flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-white text-forest shadow-[0_12px_32px_rgba(18,35,20,0.22)] ring-1 ring-rule transition-[transform,box-shadow,ring-color] duration-200 hover:scale-105 hover:shadow-[0_14px_36px_rgba(18,35,20,0.28)] hover:ring-black/15 hover:text-ink active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage sm:bottom-6 sm:right-6 ${
          open ? "max-sm:hidden" : ""
        }`}
        aria-label={open ? "Close chat" : `Chat with ${agent.name}`}
        aria-expanded={open}
      >
        {open ? (
          <X size={22} weight="bold" />
        ) : (
          <ChatCircleDots size={28} weight="fill" />
        )}
      </button>
    </>
  );
}
