"use client";

import { useState } from "react";

interface ExpandableTextProps {
  text: string;
  /** Characters shown before the See More toggle kicks in. */
  limit?: number;
  className?: string;
}

// The reference package pages show a short paragraph with a "See More"/"See
// Less" toggle instead of a wall of text. This mirrors that pattern so the
// overview stays scannable and concise.
export default function ExpandableText({
  text,
  limit = 280,
  className = "",
}: ExpandableTextProps) {
  const [open, setOpen] = useState(false);

  if (!text) return null;

  const needsTruncation = text.length > limit;
  if (!needsTruncation) {
    return <p className={className}>{text}</p>;
  }

  const rawShown = open ? text : text.slice(0, limit);
  // Cut at a word boundary instead of mid-word.
  const wordCut = rawShown.lastIndexOf(" ");
  const shown = open ? text : wordCut > limit * 0.6 ? rawShown.slice(0, wordCut) : rawShown;

  return (
    <p className={className}>
      {shown}
      {!open && "… "}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="text-legacy-orange font-bold text-[13px] hover:underline inline align-baseline"
      >
        {open ? "See Less" : "See More"}
      </button>
    </p>
  );
}
