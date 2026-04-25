"use client";

import { useState, useCallback } from "react";
import type { QuizQuestion } from "@/types/index";

const QUESTIONS: QuizQuestion[] = [
  {
    q: "Which organelle is responsible for producing ATP through cellular respiration?",
    opts: ["Nucleus", "Mitochondria", "Ribosome", "Golgi Apparatus"],
    ans: 1,
    exp: "Mitochondria are the powerhouse of the cell, converting glucose into ATP via cellular respiration. High-frequency AP Bio topic.",
    tag: "AP Biology · Unit 1",
  },
  {
    q: "Which of the following best describes the demographic transition model?",
    opts: [
      "A model showing how birth and death rates change as countries develop",
      "A map of global population distribution",
      "A theory about immigration patterns",
      "A measure of population density",
    ],
    ans: 0,
    exp: "The DTM shows how birth and death rates shift through stages of economic development — core AP Human Geo Unit 2 concept.",
    tag: "AP Human Geography · Unit 2",
  },
  {
    q: "Which of the following is an example of a binary number?",
    opts: ["1025", "1010", "2048", "ABCD"],
    ans: 1,
    exp: "Binary uses only 0s and 1s. 1010 is a valid binary number. AP CSP Unit 2 covers number systems and data representation.",
    tag: "AP CSP · Unit 2",
  },
  {
    q: "In the cell cycle, DNA replication occurs during which phase?",
    opts: ["G1 phase", "S phase", "G2 phase", "M phase"],
    ans: 1,
    exp: "DNA replication happens during the S (synthesis) phase of interphase. This is heavily tested on the AP Biology exam.",
    tag: "AP Biology · Unit 4",
  },
];

const LETTERS = ["A", "B", "C", "D"] as const;

type AnswerState = "idle" | "answered";

export default function HeroQuizWidget() {
  const [current, setCurrent] = useState(0);
  const [answerState, setAnswerState] = useState<AnswerState>("idle");
  const [chosenIndex, setChosenIndex] = useState<number | null>(null);
  const [isDone, setIsDone] = useState(false);

  const question = QUESTIONS[current];
  const progress = ((current + 1) / QUESTIONS.length) * 100;
  const isLast = current >= QUESTIONS.length - 1;

  const handleAnswer = useCallback(
    (idx: number) => {
      if (answerState === "answered") return;
      setChosenIndex(idx);
      setAnswerState("answered");
    },
    [answerState]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, idx: number) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleAnswer(idx);
      }
    },
    [handleAnswer]
  );

  const handleNext = useCallback(() => {
    if (isLast) {
      setIsDone(true);
      return;
    }
    setCurrent((prev) => prev + 1);
    setAnswerState("idle");
    setChosenIndex(null);
  }, [isLast]);

  const answered = answerState === "answered";

  const getOptClass = (idx: number): string => {
    if (!answered) return "opt";
    if (idx === question.ans) return "opt show-correct";
    if (idx === chosenIndex) {
      return chosenIndex === question.ans ? "opt chosen-correct" : "opt chosen-wrong";
    }
    return "opt";
  };

  return (
    <div className="qcard" role="region" aria-label="Sample AP practice question">
      <div className="ctop">
        <span className="tag">{question.tag}</span>
        <span className="qnum">
          Question {current + 1} of {QUESTIONS.length}
        </span>
      </div>

      <div className="prog" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
        <div className="progb" style={{ width: `${progress}%` }} />
      </div>

      <p className="question">{question.q}</p>

      <div className="opts" aria-label="Answer choices">
        {question.opts.map((opt, idx) => (
          <div
            key={idx}
            className={getOptClass(idx)}
            role="button"
            tabIndex={answered ? -1 : 0}
            aria-disabled={answered}
            aria-label={`Option ${LETTERS[idx]}: ${opt}`}
            onClick={() => handleAnswer(idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
          >
            <span className="letter">{LETTERS[idx]}</span>
            <span>{opt}</span>
          </div>
        ))}
      </div>

      {answered && (
        <div className="feedback show" role="alert">
          <strong>
            {chosenIndex === question.ans
              ? `✓ Correct — ${question.opts[question.ans]}`
              : `✗ Incorrect — ${question.opts[question.ans]}`}
          </strong>
          {question.exp}
        </div>
      )}

      {answered && !isDone && (
        <div className="nudge show">
          Want 12,000+ questions like this?{" "}
          <a href="/signup">Create your free account →</a>
        </div>
      )}

      {answered && (
        <div className="nextbtn show">
          <button
            type="button"
            onClick={handleNext}
            disabled={isDone}
            aria-label={isLast ? "All questions completed" : "Go to next question"}
          >
            {isDone ? "All questions done!" : "Next question →"}
          </button>
        </div>
      )}
    </div>
  );
}
