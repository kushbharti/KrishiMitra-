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
import { Send, Trash2, Sprout, Mic, MicOff, Square } from "lucide-react";
import PageTitle from "@/components/shared/PageTitle";
import { useTranslation } from "@/context/LanguageContext";
import { Language } from "@/context/LanguageContext";
import ReactMarkdown from "react-markdown";

// --- Web Speech API type declarations (compatible with all TS DOM lib versions) ---
interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}
interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  readonly isFinal: boolean;
}
interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}
interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}
interface ISpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onstart: ((this: ISpeechRecognition, ev: Event) => void) | null;
  onend: ((this: ISpeechRecognition, ev: Event) => void) | null;
  onresult: ((this: ISpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: ISpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}
declare global {
  interface Window {
    SpeechRecognition: new () => ISpeechRecognition;
    webkitSpeechRecognition: new () => ISpeechRecognition;
  }
}

// --- Speech locale map ---
const SPEECH_LOCALE: Record<Language, string> = {
  en: "en-IN",
  hi: "hi-IN",
  mr: "mr-IN",
};

// --- Microphone state machine ---
type MicState =
  | "idle"
  | "listening"
  | "processing"
  | "denied"
  | "unsupported"
  | "error";

// --- Categorise backend errors into user-friendly messages ---
function classifyError(error: unknown): string {
  const msg = error instanceof Error ? error.message : String(error);
  const lower = msg.toLowerCase();

  if (lower.includes("session has expired") || lower.includes("401") || lower.includes("unauthorized")) {
    return "Your session has expired. Please sign in again.";
  }
  if (lower.includes("429") || lower.includes("rate limit") || lower.includes("temporarily busy")) {
    return "The AI service is temporarily busy. Please try again shortly.";
  }
  if (lower.includes("504") || lower.includes("timed out") || lower.includes("did not respond")) {
    return "The AI service took too long to respond. Please try again.";
  }
  if (lower.includes("502") || lower.includes("unavailable") || lower.includes("authentication failed")) {
    return "The AI assistant is temporarily unavailable. Please try again in a moment.";
  }
  if (lower.includes("network") || lower.includes("failed to fetch") || lower.includes("unable to connect")) {
    return "Unable to connect to the AgroVision server. Please check your internet connection.";
  }
  return "Sorry, I couldn't get a response. Please try again.";
}

function AssistantContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") || "";
  const { t, language } = useTranslation();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState(initialQ);
  const [loading, setLoading] = useState(false);
  const [micState, setMicState] = useState<MicState>("idle");
  const [micError, setMicError] = useState<string>("");

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Pre-fill from query param
  useEffect(() => {
    if (initialQ && messages.length === 0) {
      setInput(initialQ);
    }
  }, [initialQ, messages.length]);

  // Cleanup recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
        recognitionRef.current = null;
      }
    };
  }, []);

  // Send message
  const handleSend = useCallback(
    async (overrideMessage?: string) => {
      const msg = (overrideMessage ?? input).trim();
      if (!msg || loading) return;

      const newMessage: ChatMessage = {
        role: "user",
        content: msg,
        timestamp: new Date().toISOString(),
      };
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      setInput("");
      setLoading(true);

      try {
        const reply = await sendChatMessage(msg, messages);
        setMessages([
          ...updatedMessages,
          {
            role: "assistant",
            content: reply,
            timestamp: new Date().toISOString(),
          },
        ]);
      } catch (error: unknown) {
        const friendlyMessage = classifyError(error);
        setMessages([
          ...updatedMessages,
          {
            role: "assistant",
            content: `?? ${friendlyMessage}`,
            timestamp: new Date().toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [input, messages, loading]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Check browser support
  const isSpeechSupported =
    typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

  // Stop any active recognition
  const stopRecognition = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
    setMicState("idle");
  }, []);

  // Start speech recognition
  const handleMicClick = useCallback(() => {
    setMicError("");

    if (micState === "listening") {
      stopRecognition();
      return;
    }

    if (!isSpeechSupported) {
      setMicState("unsupported");
      setMicError("Your browser does not support speech recognition. Please use Chrome or Edge.");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognitionAPI();

    recognition.lang = SPEECH_LOCALE[language] || "en-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onstart = () => {
      setMicState("listening");
      setMicError("");
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      setMicState("processing");
      const transcript = event.results[0]?.[0]?.transcript || "";
      if (transcript.trim()) {
        setInput((prev) =>
          prev.trim() ? `${prev.trim()} ${transcript.trim()}` : transcript.trim()
        );
        setTimeout(() => inputRef.current?.focus(), 50);
      }
      setMicState("idle");
      recognitionRef.current = null;
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      recognitionRef.current = null;
      switch (event.error) {
        case "not-allowed":
        case "permission-denied":
          setMicState("denied");
          setMicError("Microphone permission denied. Please allow microphone access in your browser settings.");
          break;
        case "no-speech":
          setMicState("idle");
          setMicError("No speech detected. Please try again.");
          break;
        case "network":
          setMicState("error");
          setMicError("Network error during speech recognition. Please check your connection.");
          break;
        case "audio-capture":
          setMicState("error");
          setMicError("No microphone found. Please connect a microphone and try again.");
          break;
        default:
          setMicState("error");
          setMicError(`Speech recognition error: ${event.error}`);
      }
    };

    recognition.onend = () => {
      setMicState((prev) => prev === "listening" ? "idle" : prev);
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch {
      setMicState("error");
      setMicError("Failed to start speech recognition. Please try again.");
      recognitionRef.current = null;
    }
  }, [micState, isSpeechSupported, language, stopRecognition]);

  // Mic button helpers
  const getMicButtonStyle = () => {
    switch (micState) {
      case "listening":
        return "bg-red-500 hover:bg-red-600 text-white shadow-sm animate-pulse";
      case "processing":
        return "bg-yellow-400 text-white cursor-wait";
      case "denied":
      case "unsupported":
        return "bg-slate-100 text-slate-300 cursor-not-allowed";
      default:
        return "bg-slate-100 hover:bg-[#9CC5A1]/30 text-slate-500 hover:text-[#49A078] transition-colors";
    }
  };

  const getMicIcon = () => {
    if (micState === "listening") return <Square className="w-4 h-4" />;
    if (micState === "denied" || micState === "unsupported") return <MicOff className="w-4 h-4" />;
    return <Mic className="w-4 h-4" />;
  };

  const getMicTitle = () => {
    switch (micState) {
      case "listening": return "Stop recording";
      case "processing": return "Processing speech...";
      case "denied": return "Microphone access denied";
      case "unsupported": return "Speech recognition not supported in this browser";
      case "error": return "Speech recognition error � click to retry";
      default: return "Click to speak your question";
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] max-w-4xl mx-auto p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
        <PageTitle
          title={t.assistant.title}
          subtitle={t.assistant.subtitle}
          icon={<Sprout className="w-6 h-6 text-[#49A078] hidden sm:inline" />}
        />
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:text-[#BD5532] hover:bg-[#BD5532]/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t.assistant.clearChat}</span>
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-3xl mx-auto mb-4 border border-slate-200 shadow-sm">
              ??
            </div>
            <h2 className="font-black text-[#2B2118] text-lg mb-1">
              {t.assistant.welcomeTitle}
            </h2>
            <p className="text-sm text-[#475B63] mb-6 max-w-md mx-auto font-medium">
              {t.assistant.welcomeSub}
            </p>
            <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto">
              {t.assistant.chips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => {
                    setInput(chip);
                    inputRef.current?.focus();
                  }}
                  className="bg-white border border-slate-200 text-[#2B2118] text-xs font-bold px-3.5 py-2 rounded-xl hover:bg-[#9CC5A1]/20 hover:border-[#49A078] transition-all shadow-2xs text-left"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 animate-fade-in ${
              msg.role === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-[#216869] to-[#49A078] flex items-center justify-center text-sm flex-shrink-0 shadow-sm text-white">
                ??
              </div>
            )}
            <div
              className={`max-w-[85%] px-5 py-3.5 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "chat-bubble-user font-medium whitespace-pre-wrap"
                  : "chat-bubble-ai font-normal prose prose-sm prose-slate max-w-none prose-p:leading-relaxed prose-pre:bg-slate-800 prose-pre:text-slate-100"
              }`}
            >
              {msg.role === "assistant" ? (
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 items-center animate-fade-in">
            <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-[#216869] to-[#49A078] flex items-center justify-center text-sm flex-shrink-0 shadow-sm text-white">
              ??
            </div>
            <div className="chat-bubble-ai px-5 py-4 flex gap-1.5 items-center">
              <span className="typing-dot w-2 h-2 bg-[#49A078] rounded-full" />
              <span className="typing-dot w-2 h-2 bg-[#49A078] rounded-full" />
              <span className="typing-dot w-2 h-2 bg-[#49A078] rounded-full" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="pt-3 border-t border-slate-200/80">
        {/* Microphone error banner */}
        {micError && (
          <div className="mb-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium flex items-center gap-1.5">
            <MicOff className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{micError}</span>
            <button
              onClick={() => setMicError("")}
              className="ml-auto text-red-400 hover:text-red-600"
              aria-label="Dismiss microphone error"
            >
              ?
            </button>
          </div>
        )}

        {/* Listening indicator */}
        {micState === "listening" && (
          <div className="mb-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-bold flex items-center gap-1.5 animate-pulse">
            <span className="w-2 h-2 bg-red-500 rounded-full" />
            Listening� Speak your question, then click � to stop.
          </div>
        )}

        <div className="flex gap-2 items-end bg-white border-2 border-slate-200 rounded-3xl px-4 py-2 shadow-sm focus-within:border-[#49A078] transition-colors">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.assistant.placeholder}
            rows={1}
            disabled={loading}
            aria-label="Type your farming question"
            className="flex-1 resize-none text-sm text-[#2B2118] placeholder-[#475B63] bg-transparent focus:outline-none py-1.5 max-h-32 font-medium disabled:opacity-60"
            style={{ minHeight: "28px" }}
          />

          {/* Microphone button */}
          <button
            id="assistant-mic-btn"
            onClick={handleMicClick}
            disabled={
              loading ||
              micState === "processing" ||
              micState === "denied" ||
              micState === "unsupported"
            }
            aria-label={getMicTitle()}
            title={getMicTitle()}
            className={`p-2.5 rounded-2xl flex-shrink-0 transition-all ${getMicButtonStyle()}`}
          >
            {getMicIcon()}
          </button>

          {/* Send button */}
          <button
            id="assistant-send-btn"
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            aria-label="Send message"
            className={`p-2.5 rounded-2xl transition-all flex-shrink-0 ${
              input.trim() && !loading
                ? "bg-[#49A078] hover:bg-[#3d8664] text-white shadow-sm hover:scale-105 active:scale-95"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[11px] text-[#475B63] mt-1.5 text-center font-bold">
          {t.assistant.footerTip}
        </p>
      </div>
    </div>
  );
}

export default function AssistantPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-center text-[#475B63] font-bold">
          Loading assistant...
        </div>
      }
    >
      <AssistantContent />
    </Suspense>
  );
}


