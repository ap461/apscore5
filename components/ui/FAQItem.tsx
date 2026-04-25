"use client";

import { useState, useCallback, useId } from "react";
import type { FAQItem } from "@/types/index";

interface FAQItemProps {
  faq: FAQItem;
}

/**
 * Client component — single FAQ accordion item.
 * Uses useState for open/close; replaces inline script accordion logic.
 */
export default function FAQItem({ faq }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const answerId = useId();
  const questionId = useId();

  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    },
    [toggle]
  );

  return (
    <div
      className="fi"
      itemScope
      itemProp="mainEntity"
      itemType="https://schema.org/Question"
    >
      <div
        id={questionId}
        className={`fiq${isOpen ? " open" : ""}`}
        tabIndex={0}
        role="button"
        aria-expanded={isOpen}
        aria-controls={answerId}
        onClick={toggle}
        onKeyDown={handleKeyDown}
      >
        <span className="fiq-text" itemProp="name">
          {faq.question}
        </span>
        <span className="arr" aria-hidden="true">
          ▾
        </span>
      </div>

      <div
        id={answerId}
        className={`fia${isOpen ? " show" : ""}`}
        role="region"
        aria-labelledby={questionId}
        itemScope
        itemProp="acceptedAnswer"
        itemType="https://schema.org/Answer"
      >
        <span itemProp="text">{faq.answer}</span>
      </div>
    </div>
  );
}
