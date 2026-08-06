import { useState } from "react";
import { Bot, Send, Sparkles, X, Loader2 } from "lucide-react";
import { advisorService } from "@/services/advisorService";

export function AiAdvisorModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Array<{ role: "user" | "bot"; text: string }>>([
    {
      role: "bot",
      text: "Hello! I am your MeritMind AI Advisor. Ask me anything about your scholarship match criteria, required documents, or upcoming deadlines!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setLoading(true);

    try {
      const res = await advisorService.chat(userText);
      setMessages((prev) => [...prev, { role: "bot", text: res.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Sorry, I had trouble retrieving details. Please check your backend connection or complete your profile.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "Which scholarships suit me best?",
    "Why am I eligible?",
    "Which scholarship closes soon?",
    "What documents do I need to prepare?",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative flex h-[620px] w-full max-w-lg flex-col overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between gradient-hero px-6 py-4 text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-2xl bg-white/20 text-white backdrop-blur-md">
              <Bot className="size-6" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold leading-tight">AI Scholarship Advisor</h3>
              <p className="text-xs text-primary-foreground/80">Grounded strictly on verified scholarships & your profile</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="grid size-8 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {m.role === "bot" && (
                <span className="grid size-8 shrink-0 place-items-center rounded-full gradient-hero text-xs font-bold text-primary-foreground mt-1">
                  <Sparkles className="size-4" />
                </span>
              )}
              <div
                className={`max-w-[82%] rounded-2xl p-4 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "gradient-hero text-primary-foreground font-medium rounded-tr-none"
                    : "bg-muted/70 text-foreground border border-border/50 rounded-tl-none whitespace-pre-line"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3 items-center text-xs text-muted-foreground animate-pulse">
              <Loader2 className="size-4 animate-spin text-primary" /> Analyzing database records...
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="flex flex-wrap gap-1.5 px-5 py-2 border-t border-border/40 bg-muted/20">
          {quickPrompts.map((p) => (
            <button
              key={p}
              onClick={() => {
                setInput(p);
              }}
              className="rounded-full border border-border/60 bg-background px-3 py-1 text-[11px] font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="flex items-center gap-2 p-4 border-t border-border bg-card">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about scholarships, documents, eligibility..."
            className="flex-1 rounded-full border border-border bg-muted/50 px-4 py-2.5 text-sm font-medium focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="grid size-10 shrink-0 place-items-center rounded-full gradient-hero text-primary-foreground disabled:opacity-50 transition-transform active:scale-95"
          >
            <Send className="size-4.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
