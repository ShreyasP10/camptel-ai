"use client";

import { useState } from "react";
import challenges from "@/data/challenges.json";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";

type Challenge = {
  id: string;
  category: string;
  title: string;
  description: string;
  question: string;
  followUp: string[];
};

const categoryColors: Record<string, string> = {
  academic: "border-l-brand-500 bg-brand-50 dark:border-l-brand-600 dark:bg-brand-950/20",
  placement: "border-l-emerald-500 bg-emerald-50 dark:border-l-emerald-600 dark:bg-emerald-950/20",
  infrastructure: "border-l-amber-500 bg-amber-50 dark:border-l-amber-600 dark:bg-amber-950/20",
};

const categoryIcons: Record<string, string> = {
  academic: "📊",
  placement: "🎯",
  infrastructure: "🏛️",
};

function ChallengeDetail({
  challenge,
  onBack,
}: {
  challenge: Challenge;
  onBack: () => void;
}) {
  const [answer, setAnswer] = useState<string | null>(null);
  const [sql, setSql] = useState<string | null>(null);
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runQuery = async (question: string) => {
    setLoading(true);
    setError(null);
    setAnswer(null);
    setSql(null);
    setRows([]);

    try {
      const res = await fetch("/api/ask-gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setAnswer(data.answer);
        setSql(data.sql);
        setRows(data.rows || []);
      }
    } catch {
      setError("Failed to get response. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const color = categoryColors[challenge.category] || "border-l-surface-300 bg-surface-50 dark:border-l-dark-300 dark:bg-dark-50";

  return (
    <div className="space-y-6 animate-fade-in">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-medium text-surface-500 hover:text-surface-700 dark:text-dark-500 dark:hover:text-dark-700 transition"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back to challenges
      </button>

      <div className={`rounded-2xl border-l-4 p-6 ${color}`}>
        <span className="text-2xl">{categoryIcons[challenge.category] || "📋"}</span>
        <h2 className="mt-3 text-xl font-bold text-surface-900 dark:text-dark-800">{challenge.title}</h2>
        <p className="mt-1 text-surface-600 dark:text-dark-600">{challenge.description}</p>
      </div>

      {!answer && !loading && !error && (
        <Card>
          <div className="text-center py-6">
            <p className="text-sm text-surface-400 dark:text-dark-500 mb-4">
              Click below to run this challenge against live data.
            </p>
            <button
              type="button"
              onClick={() => runQuery(challenge.question)}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-700 transition"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
              </svg>
              Run Query
            </button>
          </div>
        </Card>
      )}

      {loading && (
        <Card>
          <div className="py-8">
            <Spinner />
            <p className="mt-3 text-center text-sm text-surface-400 dark:text-dark-500">
              Querying data and generating insights...
            </p>
          </div>
        </Card>
      )}

      {error && (
        <Card className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30">
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          <button
            type="button"
            onClick={() => runQuery(challenge.question)}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition"
          >
            Retry
          </button>
        </Card>
      )}

      {answer && (
        <>
          <Card variant="bordered" className="border-brand-200 bg-gradient-to-br from-brand-50 to-white dark:border-brand-800 dark:from-brand-950/30 dark:to-dark-100">
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm dark:bg-brand-900/40">✦</span>
              <div>
                <p className="text-sm font-semibold text-brand-700 dark:text-brand-400">AI Insight</p>
                <p className="mt-2 text-surface-700 dark:text-dark-700 leading-relaxed">{answer}</p>
              </div>
            </div>
          </Card>

          {sql && (
            <details className="rounded-xl border border-surface-200 bg-surface-50 p-4 dark:border-dark-200 dark:bg-dark-50">
              <summary className="cursor-pointer text-sm font-semibold text-surface-600 hover:text-surface-800 dark:text-dark-500 dark:hover:text-dark-700">
                Show SQL Query
              </summary>
              <pre className="mt-3 overflow-x-auto rounded-lg bg-surface-900 p-4 text-xs text-emerald-400 font-mono whitespace-pre-wrap dark:bg-dark-900">
                {sql}
              </pre>
            </details>
          )}

          {rows.length > 0 && (
            <Card title="Results" subtitle={`${rows.length} row${rows.length !== 1 ? "s" : ""} returned`}>
              <div className="overflow-x-auto scrollbar-thin">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-surface-100 text-surface-400 dark:border-dark-200 dark:text-dark-500">
                      {Object.keys(rows[0]).map((key) => (
                        <th key={key} className="pb-3 pr-4 font-semibold capitalize">{key.replace(/_/g, " ")}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr key={i} className="border-b border-surface-50 transition hover:bg-surface-50 dark:border-dark-50 dark:hover:bg-dark-50">
                        {Object.values(row).map((val, j) => (
                          <td key={j} className="py-3 pr-4 text-surface-600 dark:text-dark-600">{String(val ?? "—")}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          <Card title="Follow-up Actions">
            <div className="flex flex-wrap gap-2">
              {challenge.followUp.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => {
                    runQuery(q);
                  }}
                  disabled={loading}
                  className="rounded-xl border border-surface-200 bg-white px-4 py-2.5 text-sm font-medium text-surface-600 shadow-sm transition hover:border-brand-200 hover:text-brand-600 disabled:opacity-50 dark:border-dark-200 dark:bg-dark-100 dark:text-dark-500 dark:hover:border-brand-700 dark:hover:text-brand-400"
                >
                  {q}
                </button>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

export default function ChallengesPage() {
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);

  const activeChallenge = activeChallengeId
    ? (challenges as Challenge[]).find((c) => c.id === activeChallengeId)
    : null;

  if (activeChallenge) {
    return (
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <ChallengeDetail
          challenge={activeChallenge}
          onBack={() => setActiveChallengeId(null)}
        />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-2xl shadow-lg shadow-amber-600/20">
          🧩
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-surface-900 dark:text-dark-800 transition-colors">
          Decision Challenges
        </h1>
        <p className="mt-2 text-surface-500 dark:text-dark-500 transition-colors">
          Pre-built decision scenarios to help you act on campus data.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {(challenges as Challenge[]).map((challenge) => {
          const color = categoryColors[challenge.category] || "border-l-surface-300 bg-surface-50 dark:border-l-dark-300 dark:bg-dark-50";
          return (
            <button
              key={challenge.id}
              type="button"
              onClick={() => setActiveChallengeId(challenge.id)}
              className={`group rounded-2xl border-l-4 p-6 text-left shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${color}`}
            >
              <span className="text-2xl">{categoryIcons[challenge.category] || "📋"}</span>
              <h3 className="mt-3 text-lg font-semibold text-surface-900 dark:text-dark-800 group-hover:text-brand-700 dark:group-hover:text-brand-400 transition">
                {challenge.title}
              </h3>
              <p className="mt-1.5 text-sm text-surface-500 dark:text-dark-500 leading-relaxed">
                {challenge.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-600 dark:text-brand-400 opacity-0 group-hover:opacity-100 transition">
                Run challenge
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </span>
            </button>
          );
        })}
      </div>
    </main>
  );
}
