"use client";

import { Content } from "@prismicio/client";
import { PrismicRichText, SliceComponentProps } from "@prismicio/react";
import { useEffect, useMemo, useState } from "react";

export type ApPlanningPollProps = SliceComponentProps<Content.ApPlanningPollSlice>;

type Counts = Record<string, number>;

const ApPlanningPoll = ({ slice }: ApPlanningPollProps): JSX.Element => {
  const {
    eyebrow,
    headline,
    lede,
    poll_id,
    show_results_before_vote,
    allow_revote,
    total_votes_label,
  } = slice.primary;

  const pollId = (poll_id as string) || "ap_planning_poll";
  const storageKey = `apscore5_vote_${pollId}`;

  const options = (slice.items || []).map((item) => ({
    label: (item.option_label as string) || "",
    value: (item.option_value as string) || "",
  }));

  const [counts, setCounts] = useState<Counts>(() =>
    Object.fromEntries(options.map((o) => [o.value, 0]))
  );
  const [votedValue, setVotedValue] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Load existing vote + counts on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const prior = window.localStorage.getItem(storageKey);
    if (prior) setVotedValue(prior);

    fetch(`/api/poll?poll_id=${encodeURIComponent(pollId)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.counts) setCounts(data.counts);
      })
      .catch(() => {
        /* fall back to zeros — non-fatal */
      });
  }, [pollId, storageKey]);

  const totalVotes = useMemo(
    () => Object.values(counts).reduce((a, b) => a + b, 0),
    [counts]
  );

  const showResults =
    votedValue !== null || (show_results_before_vote && totalVotes > 0);

  const canVote = !votedValue || allow_revote;

  async function handleVote(optionValue: string) {
    if (!canVote || submitting) return;
    setSubmitting(true);

    // Optimistic update
    setCounts((prev) => {
      const next = { ...prev };
      if (votedValue && allow_revote && next[votedValue] > 0) {
        next[votedValue] -= 1;
      }
      next[optionValue] = (next[optionValue] || 0) + 1;
      return next;
    });
    setVotedValue(optionValue);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, optionValue);
    }

    try {
      const res = await fetch("/api/poll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          poll_id: pollId,
          option_value: optionValue,
          previous_value: allow_revote ? votedValue : null,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.counts) setCounts(data.counts);
      }
    } catch {
      /* server unavailable — local state still reflects the vote */
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="bg-slate-50 py-16 px-6 md:px-12"
    >
      <div className="max-w-3xl mx-auto">
        {eyebrow && (
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-orange-600 mb-3">
            {eyebrow as string}
          </p>
        )}

        <div className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 leading-tight">
          <PrismicRichText field={headline} />
        </div>

        {lede && (
          <div className="text-base md:text-lg text-slate-600 mb-8">
            <PrismicRichText field={lede} />
          </div>
        )}

        <div className="space-y-3">
          {options.map((option) => {
            const count = counts[option.value] || 0;
            const pct =
              totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
            const isMine = votedValue === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleVote(option.value)}
                disabled={!canVote || submitting}
                className={`relative w-full text-left rounded-xl border-2 transition overflow-hidden ${
                  isMine
                    ? "border-blue-600 bg-white"
                    : "border-slate-200 bg-white hover:border-blue-400"
                } ${
                  !canVote ? "cursor-default" : "cursor-pointer"
                } px-5 py-4`}
                aria-pressed={isMine}
              >
                {showResults && (
                  <div
                    className={`absolute inset-y-0 left-0 ${
                      isMine ? "bg-blue-100" : "bg-slate-100"
                    } transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex items-center justify-between gap-4">
                  <span className="font-semibold text-slate-900">
                    {option.label}
                    {isMine && (
                      <span className="ml-2 text-xs font-bold text-blue-700">
                        · your vote
                      </span>
                    )}
                  </span>
                  {showResults && (
                    <span className="font-bold text-slate-700 tabular-nums">
                      {pct}%
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <p className="mt-6 text-sm text-slate-500">
          {totalVotes.toLocaleString()}{" "}
          {(total_votes_label as string) || "students have voted"}
          {votedValue && allow_revote && " · tap another option to change your vote"}
        </p>
      </div>
    </section>
  );
};

export default ApPlanningPoll;
