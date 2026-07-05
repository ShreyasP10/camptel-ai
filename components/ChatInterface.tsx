"use client";

import { useEffect, useRef, useState } from "react";
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
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    window.setTimeout(() => {
      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: "Here is a concise insight from the campus data layer.",
        sql: `SELECT student_name, risk_score FROM academic_risk WHERE attendance < 60 ORDER BY risk_score DESC LIMIT 10;`,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setLoading(false);
    }, 800);
  };

  return (
    <main className="mx-auto flex max-w-5xl flex-col px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-semibold text-slate-900">Ask CampusPulse AI</h1>
        <p className="mt-2 text-slate-600">
          Ask questions about student performance, placements, or resources in plain English.
        </p>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="flex h-[500px] flex-col bg-slate-50">
          <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
            {!messages.length && !loading && (
              <div className="mx-auto flex max-w-2xl flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
                <p className="text-xl font-semibold text-slate-900">👋 Hi Dean! I can help you identify at-risk students, check placement readiness, or find classroom conflicts.</p>
                <p className="mt-2 text-sm text-slate-600">Try asking a question above.</p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {starterSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => sendMessage(suggestion)}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm shadow-sm ${message.role === "user" ? "bg-blue-600 text-white" : "border border-slate-200 bg-white text-slate-700"}`}>
                  <p>{message.content}</p>
                  {message.sql && (
                    <details className="mt-3 rounded-2xl bg-slate-900 p-3 text-xs text-emerald-400">
                      <summary className="cursor-pointer font-semibold">Show SQL</summary>
                      <pre className="mt-2 overflow-x-auto whitespace-pre-wrap font-mono">{message.sql}</pre>
                    </details>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="max-w-[70%] rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:120ms]" />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:240ms]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-slate-200 bg-white p-3 sm:p-4">
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    sendMessage(input);
                  }
                }}
                placeholder="e.g., Which CS students have attendance below 60%?"
                className="flex-1 bg-transparent px-2 py-2 text-sm outline-none"
              />
              <button
                type="button"
                onClick={() => sendMessage(input)}
                disabled={loading}
                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
              >
                {loading ? "Thinking..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      </Card>
    </main>
  );
}
