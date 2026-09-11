"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  Suspense,
} from "react";
import { useSearchParams } from "next/navigation";
import { ChatMessage } from "@/types";
import { sendChatMessage } from "@/lib/api";
import {
  Send,
  Trash2,
  Mic,
  MicOff,
  Square,
  Globe,
  ChevronDown,
  Sprout,
  Leaf,
  Sparkles,
  AlertCircle,
  X,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useSpring,
  useTransform,
} from "framer-motion";
import { useTranslation } from "@/context/LanguageContext";
import { Language } from "@/context/LanguageContext";
import ReactMarkdown from "react-markdown";

// ---------------------------------------------------------------------------
// Web Speech API types
// ---------------------------------------------------------------------------
interface SpeechRecognitionAlternative { readonly transcript: string; readonly confidence: number }
interface SpeechRecognitionResult {
  readonly length: number;
  item(i: number): SpeechRecognitionAlternative;
  [i: number]: SpeechRecognitionAlternative;
  readonly isFinal: boolean;
}
interface SpeechRecognitionResultList {
  readonly length: number;
  item(i: number): SpeechRecognitionResult;
  [i: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionEvent extends Event { readonly resultIndex: number; readonly results: SpeechRecognitionResultList }
interface SpeechRecognitionErrorEvent extends Event { readonly error: string; readonly message: string }
interface ISpeechRecognition extends EventTarget {
  lang: string; continuous: boolean; interimResults: boolean; maxAlternatives: number;
  onstart: ((e: Event) => void) | null;
  onend: ((e: Event) => void) | null;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror: ((e: SpeechRecognitionErrorEvent) => void) | null;
  start(): void; stop(): void; abort(): void;
}
declare global {
  interface Window {
    SpeechRecognition: new () => ISpeechRecognition;
    webkitSpeechRecognition: new () => ISpeechRecognition;
  }
}

// ---------------------------------------------------------------------------
// Types & constants
// ---------------------------------------------------------------------------
type ResponseLang = "en" | "hi" | "mr";
type MicState = "idle" | "listening" | "processing" | "denied" | "unsupported" | "error";

const SPEECH_LOCALE: Record<Language, string> = { en: "en-IN", hi: "hi-IN", mr: "mr-IN" };

const RESPONSE_LANG_OPTIONS: { value: ResponseLang; label: string }[] = [
  { value: "en", label: "English" },
  { value: "hi", label: "हिन्दी" },
  { value: "mr", label: "मराठी" },
];

const QUICK_CHIPS: Record<ResponseLang, { icon: string; text: string }[]> = {
  en: [
    { icon: "🍅", text: "How to prevent tomato diseases?" },
    { icon: "🌦", text: "Weather risks for my crops?" },
    { icon: "💧", text: "How often to irrigate wheat?" },
    { icon: "🌾", text: "Best crops for Rabi season?" },
    { icon: "🐛", text: "Natural pest control methods?" },
  ],
  hi: [
    { icon: "🍅", text: "टमाटर की बीमारियों से बचाव कैसे करें?" },
    { icon: "🌦", text: "मेरी फसल के लिए मौसम जोखिम?" },
    { icon: "💧", text: "गेहूं में कितनी सिंचाई करें?" },
    { icon: "🌾", text: "रबी के लिए सबसे अच्छी फसल?" },
    { icon: "🐛", text: "प्राकृतिक कीट नियंत्रण?" },
  ],
  mr: [
    { icon: "🍅", text: "टोमॅटोच्या रोगांपासून कसे वाचवावे?" },
    { icon: "🌦", text: "माझ्या पिकाला हवामान धोका?" },
    { icon: "💧", text: "गव्हाला किती सिंचन?" },
    { icon: "🌾", text: "रब्बी हंगामासाठी सर्वोत्तम पीक?" },
    { icon: "🐛", text: "नैसर्गिक कीड नियंत्रण?" },
  ],
};

const UI_COPY = {
  en: {
    langLabel: "Response Language",
    welcomeTitle: "AI Farming Assistant",
    welcomeSub: "Ask me about crops, diseases, irrigation, weather risks, and government schemes.",
    placeholder: "Ask your farming question…",
    listeningBanner: "Listening… Speak your question, then click ■ to stop.",
    thinking: "KrishiMitra is thinking…",
    clearChat: "Clear",
    footerTip: "KrishiMitra AI · Advice is general — consult your local KVK for ground decisions.",
  },
  hi: {
    langLabel: "उत्तर की भाषा",
    welcomeTitle: "AI कृषि सहायक",
    welcomeSub: "फसल, रोग, सिंचाई, मौसम और सरकारी योजनाओं के बारे में पूछें।",
    placeholder: "अपना कृषि प्रश्न पूछें…",
    listeningBanner: "सुन रहा है… बोलें, फिर ■ दबाएं।",
    thinking: "KrishiMitra सोच रहा है…",
    clearChat: "साफ करें",
    footerTip: "KrishiMitra AI · सलाह सामान्य है — स्थानीय KVK से सलाह लें।",
  },
  mr: {
    langLabel: "उत्तराची भाषा",
    welcomeTitle: "AI शेती सहाय्यक",
    welcomeSub: "पीक, रोग, सिंचन, हवामान आणि सरकारी योजनांबद्दल विचारा.",
    placeholder: "तुमचा शेती प्रश्न विचारा…",
    listeningBanner: "ऐकत आहे… बोला, मग ■ दाबा.",
    thinking: "KrishiMitra विचार करत आहे…",
    clearChat: "साफ करा",
    footerTip: "KrishiMitra AI · सल्ला सामान्य आहे — स्थानिक KVK शी सल्ला घ्या.",
  },
};

function classifyError(error: unknown, lang: ResponseLang): string {
  const msg = error instanceof Error ? error.message : String(error);
  const lower = msg.toLowerCase();
  const M: Record<ResponseLang, Record<string, string>> = {
    en: { auth: "Session expired. Please sign in again.", busy: "AI service is busy. Try again shortly.", timeout: "AI took too long. Please try again.", unavailable: "AI assistant is unavailable. Try again.", network: "Connection error. Check your internet.", default: "Could not get a response. Please try again." },
    hi: { auth: "सत्र समाप्त हो गया। पुनः लॉगिन करें।", busy: "AI सेवा व्यस्त है। थोड़ी देर बाद प्रयास करें।", timeout: "AI ने उत्तर नहीं दिया। पुनः प्रयास करें।", unavailable: "AI सहायक उपलब्ध नहीं है।", network: "कनेक्शन त्रुटि। इंटरनेट जांचें।", default: "उत्तर नहीं मिला। पुनः प्रयास करें।" },
    mr: { auth: "सत्र संपले. पुन्हा लॉगिन करा.", busy: "AI व्यस्त आहे. थोड्या वेळाने पुन्हा करा.", timeout: "AI ने उत्तर दिले नाही. पुन्हा करा.", unavailable: "AI उपलब्ध नाही.", network: "कनेक्शन त्रुटी. इंटरनेट तपासा.", default: "उत्तर मिळाले नाही. पुन्हा प्रयत्न करा." },
  };
  const m = M[lang];
  if (lower.includes("401") || lower.includes("expired")) return m.auth;
  if (lower.includes("429") || lower.includes("busy")) return m.busy;
  if (lower.includes("504") || lower.includes("timeout")) return m.timeout;
  if (lower.includes("502") || lower.includes("unavailable")) return m.unavailable;
  if (lower.includes("network") || lower.includes("fetch")) return m.network;
  return m.default;
}

// ---------------------------------------------------------------------------
// Animation variants
// ---------------------------------------------------------------------------
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fadeUp: any = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
};

const fadeIn = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: (custom?: number) => ({ opacity: 1, scale: 1, transition: { duration: 0.28 } }),
  exit: { opacity: 0, scale: 0.94 },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const slideDown: any = {
  hidden: { opacity: 0, y: -6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22 } },
  exit: { opacity: 0, y: -4, transition: { duration: 0.18 } },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const staggerContainer: any = {
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const chipVariant: any = {
  hidden: { opacity: 0, scale: 0.88, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 22 } },
};

// ---------------------------------------------------------------------------
// Typing dots component
// ---------------------------------------------------------------------------
function TypingDots() {
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 bg-[#49A078] rounded-full block"
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Mic pulse ring
// ---------------------------------------------------------------------------
function MicPulseRing() {
  return (
    <span className="absolute inset-0 rounded-xl">
      <motion.span
        className="absolute inset-0 rounded-xl bg-red-400 opacity-40"
        animate={{ scale: [1, 1.7], opacity: [0.4, 0] }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeOut" }}
      />
    </span>
  );
}

// ---------------------------------------------------------------------------
// Language selector
// ---------------------------------------------------------------------------
function LangSelector({ value, onChange }: { value: ResponseLang; onChange: (v: ResponseLang) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const selected = RESPONSE_LANG_OPTIONS.find((o) => o.value === value)!;

  return (
    <div className="relative" ref={ref}>
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Select response language"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-[#49A078]/30 bg-[#49A078]/5 text-[#216869] hover:border-[#49A078]/60 hover:bg-[#49A078]/10 transition-colors"
      >
        <Globe className="w-3.5 h-3.5" />
        <span>{selected.label}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-3 h-3 text-[#49A078]" />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="listbox"
            className="absolute right-0 top-full mt-1.5 z-50 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden min-w-[140px] py-1"
          >
            {RESPONSE_LANG_OPTIONS.map((opt) => (
              <motion.button
                key={opt.value}
                role="option"
                aria-selected={opt.value === value}
                whileHover={{ backgroundColor: "rgba(73,160,120,0.08)" }}
                onClick={() => { onChange(opt.value); setOpen(false); }}
                className={`w-full px-4 py-2.5 text-left text-sm font-semibold transition-colors ${
                  opt.value === value ? "text-[#216869] bg-[#9CC5A1]/15" : "text-slate-600"
                }`}
              >
                <span className="flex items-center gap-2">
                  {opt.value === value && (
                    <motion.span
                      layoutId="lang-dot"
                      className="w-1.5 h-1.5 rounded-full bg-[#49A078] flex-shrink-0"
                    />
                  )}
                  {opt.value !== value && <span className="w-1.5 h-1.5" />}
                  {opt.label}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Message bubble
// ---------------------------------------------------------------------------
function MessageBubble({ msg, index }: { msg: ChatMessage; index: number }) {
  const isUser = msg.role === "user";

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      layout
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      {!isUser && (
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.05 }}
          className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#216869] to-[#49A078] flex items-center justify-center flex-shrink-0 shadow-md mt-0.5"
        >
          <Leaf className="w-4 h-4 text-white" />
        </motion.div>
      )}

      <motion.div
        layout
        className={`max-w-[88%] sm:max-w-[80%] rounded-2xl text-sm leading-relaxed ${
          isUser
            ? "bg-gradient-to-br from-[#216869] to-[#2d8a78] text-white px-4 py-3 font-medium whitespace-pre-wrap rounded-tr-sm shadow-md"
            : "bg-white border border-slate-100 px-5 py-4 text-[#1a2e2a] rounded-tl-sm shadow-sm prose prose-sm max-w-none prose-headings:text-[#216869] prose-headings:font-bold prose-headings:mt-3 prose-headings:mb-1.5 prose-p:leading-relaxed prose-p:my-1.5 prose-li:my-0.5 prose-strong:text-[#2B2118] prose-pre:bg-slate-800 prose-pre:text-slate-100 prose-code:text-[#216869] prose-code:bg-[#9CC5A1]/15 prose-code:px-1 prose-code:rounded prose-code:text-xs"
        }`}
      >
        {!isUser ? <ReactMarkdown>{msg.content}</ReactMarkdown> : msg.content}
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main content
// ---------------------------------------------------------------------------
function AssistantContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") || "";
  const { language } = useTranslation();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState(initialQ);
  const [loading, setLoading] = useState(false);
  const [responseLang, setResponseLang] = useState<ResponseLang>("en");
  const [micState, setMicState] = useState<MicState>("idle");
  const [micError, setMicError] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  const copy = UI_COPY[responseLang];
  const chips = QUICK_CHIPS[responseLang];

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);
  useEffect(() => { if (initialQ && messages.length === 0) setInput(initialQ); }, [initialQ, messages.length]);
  useEffect(() => { return () => { recognitionRef.current?.abort(); recognitionRef.current = null; }; }, []);

  const handleSend = useCallback(async (overrideMessage?: string) => {
    const msg = (overrideMessage ?? input).trim();
    if (!msg || loading) return;
    const newMsg: ChatMessage = { role: "user", content: msg, timestamp: new Date().toISOString() };
    const updated = [...messages, newMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);
    try {
      const reply = await sendChatMessage(msg, messages, responseLang);
      setMessages([...updated, { role: "assistant", content: reply, timestamp: new Date().toISOString() }]);
    } catch (err: unknown) {
      const friendly = classifyError(err, responseLang);
      setMessages([...updated, { role: "assistant", content: `⚠️ ${friendly}`, timestamp: new Date().toISOString() }]);
    } finally {
      setLoading(false);
    }
  }, [input, messages, loading, responseLang]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // Microphone
  const isSpeechSupported = typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);
  const stopRecognition = useCallback(() => { recognitionRef.current?.abort(); recognitionRef.current = null; setMicState("idle"); }, []);

  const handleMicClick = useCallback(() => {
    setMicError("");
    if (micState === "listening") { stopRecognition(); return; }
    if (!isSpeechSupported) { setMicState("unsupported"); setMicError("Speech recognition not supported. Use Chrome or Edge."); return; }
    recognitionRef.current?.abort(); recognitionRef.current = null;
    const API = window.SpeechRecognition || window.webkitSpeechRecognition;
    const r = new API();
    r.lang = SPEECH_LOCALE[language] || "en-IN";
    r.interimResults = false; r.maxAlternatives = 1; r.continuous = false;
    r.onstart = () => { setMicState("listening"); setMicError(""); };
    r.onresult = (e: SpeechRecognitionEvent) => {
      setMicState("processing");
      const t = e.results[0]?.[0]?.transcript || "";
      if (t.trim()) { setInput((p) => p.trim() ? `${p.trim()} ${t.trim()}` : t.trim()); setTimeout(() => inputRef.current?.focus(), 50); }
      setMicState("idle"); recognitionRef.current = null;
    };
    r.onerror = (e: SpeechRecognitionErrorEvent) => {
      recognitionRef.current = null;
      if (e.error === "not-allowed" || e.error === "permission-denied") { setMicState("denied"); setMicError("Microphone access denied. Allow it in browser settings."); }
      else if (e.error === "no-speech") { setMicState("idle"); setMicError("No speech detected. Try again."); }
      else if (e.error === "audio-capture") { setMicState("error"); setMicError("No microphone found."); }
      else { setMicState("error"); setMicError(`Speech error: ${e.error}`); }
    };
    r.onend = () => { setMicState((p) => p === "listening" ? "idle" : p); recognitionRef.current = null; };
    recognitionRef.current = r;
    try { r.start(); } catch { setMicState("error"); setMicError("Failed to start speech recognition."); recognitionRef.current = null; }
  }, [micState, isSpeechSupported, language, stopRecognition]);

  const micIsListening = micState === "listening";
  const micDisabled = loading || micState === "processing" || micState === "denied" || micState === "unsupported";

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] max-w-4xl mx-auto px-3 sm:px-6 py-4">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex items-center justify-between pb-3 border-b border-slate-100 gap-3"
      >
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: [0, -8, 8, 0] }}
            transition={{ duration: 0.5 }}
            className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#1a5c5c] to-[#49A078] flex items-center justify-center shadow-lg flex-shrink-0"
          >
            <Sprout className="w-5 h-5 text-white" />
          </motion.div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-black text-[#1a2e2a] text-base sm:text-lg leading-tight">{copy.welcomeTitle}</h1>
              <motion.div
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#49A078]" />
              </motion.div>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">Powered by KrishiMitra AI</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LangSelector value={responseLang} onChange={setResponseLang} />
          <AnimatePresence>
            {messages.length > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMessages([])}
                aria-label={copy.clearChat}
                title={copy.clearChat}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors border border-transparent hover:border-red-100"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{copy.clearChat}</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto py-5 space-y-5 scroll-smooth">
        <AnimatePresence mode="wait">
          {messages.length === 0 && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center h-full pb-10 text-center"
            >
              {/* Animated icon */}
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                className="relative mb-5"
              >
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#216869]/10 to-[#49A078]/15 border border-[#49A078]/20 flex items-center justify-center shadow-inner">
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="text-4xl select-none"
                  >
                    🌱
                  </motion.div>
                </div>
                <motion.div
                  animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -inset-2 rounded-[28px] border border-[#49A078]/20"
                />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-black text-[#1a2e2a] text-xl mb-2"
              >
                {copy.welcomeTitle}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 }}
                className="text-sm text-slate-500 mb-7 max-w-xs font-medium leading-relaxed"
              >
                {copy.welcomeSub}
              </motion.p>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="flex flex-wrap justify-center gap-2 max-w-lg px-2"
              >
                {chips.map((chip) => (
                  <motion.button
                    key={chip.text}
                    variants={chipVariant}
                    whileHover={{ scale: 1.04, y: -2, boxShadow: "0 4px 16px rgba(73,160,120,0.18)" }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { setInput(chip.text); inputRef.current?.focus(); }}
                    className="flex items-center gap-2 bg-white border border-slate-200 text-[#2B2118] text-xs font-semibold px-3.5 py-2 rounded-xl hover:border-[#49A078]/50 hover:bg-[#9CC5A1]/8 transition-colors shadow-sm text-left"
                  >
                    <span className="text-base leading-none">{chip.icon}</span>
                    <span className="leading-snug">{chip.text}</span>
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Messages list */}
        {messages.map((msg, i) => (
          <MessageBubble key={i} msg={msg} index={i} />
        ))}

        {/* Thinking indicator */}
        <AnimatePresence>
          {loading && (
            <motion.div
              key="thinking"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex gap-3 items-start"
            >
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#216869] to-[#49A078] flex items-center justify-center flex-shrink-0 shadow-md mt-0.5"
              >
                <Leaf className="w-4 h-4 text-white" />
              </motion.div>
              <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm flex items-center gap-3">
                <TypingDots />
                <span className="text-xs text-slate-400 font-medium ml-1">{copy.thinking}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* ── Input area ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
        className="pt-3 border-t border-slate-100 space-y-2"
      >
        {/* Mic error banner */}
        <AnimatePresence>
          {micError && (
            <motion.div
              variants={slideDown}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium overflow-hidden"
            >
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="flex-1">{micError}</span>
              <button onClick={() => setMicError("")} aria-label="Dismiss" className="text-red-300 hover:text-red-500 flex-shrink-0 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Listening banner */}
        <AnimatePresence>
          {micIsListening && (
            <motion.div
              variants={slideDown}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-bold overflow-hidden"
            >
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"
              />
              <span>{copy.listeningBanner}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Input row */}
        <div
          className="flex gap-2 items-end bg-white border-2 border-slate-200 rounded-2xl px-3 py-2 shadow-sm transition-all focus-within:border-[#49A078] focus-within:shadow-[0_0_0_3px_rgba(73,160,120,0.12)]"
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={copy.placeholder}
            rows={1}
            disabled={loading}
            aria-label={copy.placeholder}
            className="flex-1 resize-none text-sm text-[#1a2e2a] placeholder-slate-400 bg-transparent focus:outline-none py-1.5 max-h-36 font-medium disabled:opacity-50 leading-relaxed"
            style={{ minHeight: "28px" }}
          />

          {/* Mic button */}
          <motion.button
            id="assistant-mic-btn"
            whileHover={!micDisabled ? { scale: 1.08 } : {}}
            whileTap={!micDisabled ? { scale: 0.93 } : {}}
            onClick={handleMicClick}
            disabled={micDisabled}
            aria-label={micIsListening ? "Stop recording" : "Click to speak"}
            title={micIsListening ? "Stop recording" : "Click to speak"}
            className={`relative p-2.5 rounded-xl flex-shrink-0 transition-colors ${
              micIsListening
                ? "bg-red-500 text-white"
                : micState === "processing"
                  ? "bg-amber-400 text-white cursor-wait"
                  : micState === "denied" || micState === "unsupported"
                    ? "bg-slate-100 text-slate-300 cursor-not-allowed"
                    : "bg-slate-100 hover:bg-[#9CC5A1]/30 text-slate-500 hover:text-[#49A078]"
            }`}
          >
            {micIsListening && <MicPulseRing />}
            {micIsListening
              ? <Square className="w-4 h-4 relative z-10" />
              : micState === "denied" || micState === "unsupported"
                ? <MicOff className="w-4 h-4" />
                : <Mic className="w-4 h-4" />}
          </motion.button>

          {/* Send button */}
          <motion.button
            id="assistant-send-btn"
            whileHover={input.trim() && !loading ? { scale: 1.08 } : {}}
            whileTap={input.trim() && !loading ? { scale: 0.93 } : {}}
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            aria-label="Send message"
            className={`p-2.5 rounded-xl flex-shrink-0 transition-all ${
              input.trim() && !loading
                ? "bg-gradient-to-br from-[#216869] to-[#49A078] text-white shadow-md"
                : "bg-slate-100 text-slate-300 cursor-not-allowed"
            }`}
          >
            <motion.div animate={loading ? { rotate: 360 } : { rotate: 0 }} transition={loading ? { duration: 1, repeat: Infinity, ease: "linear" } : {}}>
              <Send className="w-4 h-4" />
            </motion.div>
          </motion.button>
        </div>

        <p className="text-[10px] text-slate-400 text-center font-medium pb-0.5">
          {copy.footerTip}
        </p>
      </motion.div>
    </div>
  );
}

export default function AssistantPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-[calc(100vh-5rem)]">
        <div className="text-center space-y-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 border-2 border-[#49A078] border-t-transparent rounded-full mx-auto"
          />
          <p className="text-sm text-slate-400 font-medium">Loading assistant…</p>
        </div>
      </div>
    }>
      <AssistantContent />
    </Suspense>
  );
}