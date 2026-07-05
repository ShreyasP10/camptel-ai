"use client";

import { useRef, useState } from "react";
import Card from "./ui/Card";

const starterSuggestions = [
  "Show CS students with high risk",
  "Who is placement ready this month?",
  "Find classroom conflicts for Thursday",
];

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  sql?: string;
  rows?: Record<string, unknown>[];
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  const sendMessage = async (value: string) => {
    const trimmed = value.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { id: Date.now(), role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    scrollToBottom();

    try {
      const res = await fetch("/api/ask-gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: trimmed }),
      });
      const data = await res.json();

      const assistantMsg: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: data.error || data.answer || "Here are the results.",
        sql: data.sql,
        rows: data.rows,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ]);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  return (
    <main className="mx-auto flex max-w-5xl flex-col px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-2xl shadow-lg shadow-brand-600/20">
          ✦
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-surface-900">Ask CampusPulse AI</h1>
        <p className="mt-2 text-surface-500">
          Ask questions about student performance, placements, or resources in plain English.
        </p>
      </div>

      <Card className="overflow-hidden p-0 shadow-lg">
        <div className="flex h-[520px] flex-col bg-surface-50">
          <div className="flex-1 space-y-4 overflow-y-auto p-4 scrollbar-thin sm:p-6">
            {!messages.length && !loading && (
              <div className="mx-auto flex max-w-2xl flex-col items-center justify-center rounded-2xl border border-dashed border-surface-300 bg-white p-10 text-center shadow-sm">
                <div className="mb-4 text-4xl">👋</div>
                <p className="text-lg font-semibold text-surface-800">
                  Hi Dean! I can help you identify at-risk students, check placement readiness, or find classroom conflicts.
                </p>
                <p className="mt-2 text-sm text-surface-400">Try asking a question below or pick a suggestion.</p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  {starterSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => sendMessage(suggestion)}
                      className="rounded-xl border border-surface-200 bg-white px-4 py-2.5 text-sm font-medium text-surface-600 shadow-sm transition hover:border-brand-200 hover:text-brand-600"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-5 py-3.5 text-sm shadow-sm ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-brand-600 to-brand-700 text-white"
                      : "border border-surface-200 bg-white text-surface-700"
                  }`}
                >
                  <p>{msg.content}</p>
                  {msg.sql && (
                    <details className="mt-3 rounded-xl bg-surface-900 p-3 text-xs text-emerald-400">
                      <summary className="cursor-pointer font-semibold text-surface-300 hover:text-white">
                        Show SQL
                      </summary>
                      <pre className="mt-2 overflow-x-auto whitespace-pre-wrap font-mono">{msg.sql}</pre>
                    </details>
                  )}
                  {msg.rows && msg.rows.length > 0 && (
                    <details className="mt-2 rounded-xl border border-surface-200 bg-surface-50 p-3">
                      <summary className="cursor-pointer text-xs font-semibold text-surface-500 hover:text-surface-700">
                        Show data ({msg.rows.length} rows)
                      </summary>
                      <div className="mt-2 overflow-x-auto">
                        <table className="min-w-full text-left text-xs">
                          <thead>
                            <tr className="text-surface-400">
                              {Object.keys(msg.rows[0]).map((key) => (
                                <th key={key} className="pb-1 pr-3 font-semibold capitalize">{key.replace(/_/g, " ")}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {msg.rows.slice(0, 5).map((row, i) => (
                              <tr key={i} className="text-surface-600">
                                {Object.values(row).map((val, j) => (
                                  <td key={j} className="py-1 pr-3">{String(val ?? "—")}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </details>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start animate-fade-in">
                <div className="max-w-[75%] rounded-2xl border border-surface-200 bg-white px-5 py-4 text-sm shadow-sm">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-surface-300" />
                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-surface-300 [animation-delay:120ms]" />
                    <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-surface-300 [animation-delay:240ms]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-surface-200 bg-white p-4">
            <div className="flex items-center gap-2 rounded-xl border border-surface-200 bg-surface-50 px-4 py-1.5 transition focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage(input);
                }}
                placeholder="e.g., Which CS students have attendance below 60%?"
                className="flex-1 bg-transparent px-2 py-3 text-sm outline-none placeholder:text-surface-400"
              />
              <button
                type="button"
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-300"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Thinking
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                    Send
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </Card>
    </main>
  );
}
