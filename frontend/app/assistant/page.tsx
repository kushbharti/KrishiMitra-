"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ChatMessage } from "@/types";
import { sendChatMessage } from "@/lib/api";
import { Send, Trash2, Sprout } from "lucide-react";
import PageTitle from "@/components/shared/PageTitle";
import { useTranslation } from "@/context/LanguageContext";
import ReactMarkdown from "react-markdown";

function AssistantContent() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") || "";
  const { t } = useTranslation();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState(initialQ);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (initialQ && messages.length === 0) {
      setInput(initialQ);
    }
  }, [initialQ, messages.length]);

  const handleSend = useCallback(async (overrideMessage?: string) => {
    const msg = (overrideMessage ?? input).trim();
    if (!msg || loading) return;

    const newMessage: ChatMessage = { role: "user", content: msg, timestamp: new Date().toISOString() };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const reply = await sendChatMessage(msg, messages);
      setMessages([...updatedMessages, { role: "assistant", content: reply, timestamp: new Date().toISOString() }]);
    } catch {
      setMessages([...updatedMessages, { role: "assistant", content: t.assistant.errorReply, timestamp: new Date().toISOString() }]);
    } finally {
      setLoading(false);
    }
  }, [input, messages, loading, t.assistant.errorReply]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] max-w-4xl mx-auto p-4 sm:p-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
        <PageTitle title={t.assistant.title} subtitle={t.assistant.subtitle} icon={<Sprout className="w-6 h-6 text-[#49A078] hidden sm:inline" />} />
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-500 hover:text-[#BD5532] hover:bg-[#BD5532]/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" /> <span>{t.assistant.clearChat}</span>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-3xl mx-auto mb-4 border border-slate-200 shadow-sm">🌱</div>
            <h2 className="font-black text-[#2B2118] text-lg mb-1">{t.assistant.welcomeTitle}</h2>
            <p className="text-sm text-[#475B63] mb-6 max-w-md mx-auto font-medium">{t.assistant.welcomeSub}</p>
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
          <div key={i} className={`flex gap-3 animate-fade-in ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-[#216869] to-[#49A078] flex items-center justify-center text-sm flex-shrink-0 shadow-sm text-white">🌱</div>
            )}
            <div className={`max-w-[85%] px-5 py-3.5 text-sm leading-relaxed ${
              msg.role === "user" ? "chat-bubble-user font-medium whitespace-pre-wrap" : "chat-bubble-ai font-normal prose prose-sm prose-slate max-w-none prose-p:leading-relaxed prose-pre:bg-slate-800 prose-pre:text-slate-100"
            }`}>
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
            <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-[#216869] to-[#49A078] flex items-center justify-center text-sm flex-shrink-0 shadow-sm text-white">🌱</div>
            <div className="chat-bubble-ai px-5 py-4 flex gap-1.5 items-center">
              <span className="typing-dot w-2 h-2 bg-[#49A078] rounded-full" />
              <span className="typing-dot w-2 h-2 bg-[#49A078] rounded-full" />
              <span className="typing-dot w-2 h-2 bg-[#49A078] rounded-full" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="pt-3 border-t border-slate-200/80">
        <div className="flex gap-2 items-end bg-white border-2 border-slate-200 rounded-3xl px-4 py-2 shadow-sm focus-within:border-[#49A078] transition-colors">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.assistant.placeholder}
            rows={1}
            className="flex-1 resize-none text-sm text-[#2B2118] placeholder-[#475B63] bg-transparent focus:outline-none py-1.5 max-h-32 font-medium"
            style={{ minHeight: "28px" }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className={`p-2.5 rounded-2xl transition-all flex-shrink-0 ${
              input.trim() && !loading ? "bg-[#49A078] hover:bg-[#3d8664] text-white shadow-sm hover:scale-105 active:scale-95" : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[11px] text-[#475B63] mt-1.5 text-center font-bold">{t.assistant.footerTip}</p>
      </div>
    </div>
  );
}

export default function AssistantPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-[#475B63] font-bold">Loading assistant...</div>}>
      <AssistantContent />
    </Suspense>
  );
}