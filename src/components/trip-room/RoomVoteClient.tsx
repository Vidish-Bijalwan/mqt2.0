"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Check, Copy, Link2, Share2, Users } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import {
  decodeRoomState,
  decodeSharedVotes,
  encodeSharedVotes,
} from "@/lib/trip-room/codec";
import { matchPackages } from "@/lib/trip-room/matcher";
import {
  CATEGORY_LABELS,
  POLL_CATEGORIES,
  type PollCategory,
  type RoomState,
  type StoredInboxEntry,
  type StoredMine,
  type VoterRecord,
} from "@/lib/trip-room/types";
import {
  computeConsensus,
  consensusWinners,
  getInbox,
  getMyVotes,
  mergeSharedVotes,
  saveMyVote,
} from "@/lib/trip-room/voteStore";
import ConsensusBars from "./ConsensusBars";
import MatchCard from "./MatchCard";

interface RoomVoteClientProps {
  roomId: string;
}

const SYNC_NOTE =
  "Votes are stored on each voter's device — there is no live sync. Votes you share are merged from invite links when someone opens them.";

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

/**
 * The room page: vote on each category, see group consensus bars computed
 * from merged votes, share invite/vote links, and view deterministic
 * package matches for the consensus winners.
 *
 * Note: this boundary renders client-side only (useSearchParams + Suspense),
 * so reading localStorage in lazy state initializers is hydration-safe.
 */
export default function RoomVoteClient({ roomId }: RoomVoteClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const rParam = searchParams.get("r");
  const vParam = searchParams.get("v");

  // Pure reads: safe to compute during render.
  const [room] = useState<RoomState | null>(() => decodeRoomState(rParam));
  const [mine, setMine] = useState<StoredMine | null>(() => getMyVotes(roomId));
  const [inbox, setInbox] = useState<StoredInboxEntry[]>(() => getInbox(roomId));
  const [mergeNotice, setMergeNotice] = useState<string | null>(null);
  const [copied, setCopied] = useState<"invite" | "votes" | null>(null);

  // Merge an incoming ?v= vote link once, at mount. The localStorage merge
  // itself is synchronous and idempotent (deduped by voter id); the React
  // state updates are deferred past the synchronous effect body so the merge
  // result always reflects this page load's merge, never a discarded render
  // attempt's. Also strips ?v= so a refresh doesn't re-process the link.
  useEffect(() => {
    if (!room || !vParam) return;
    const shared = decodeSharedVotes(vParam);
    let notice: string | null = null;
    if (!shared) {
      notice = "That vote link was invalid, so nothing was merged.";
    } else {
      const result = mergeSharedVotes(roomId, shared);
      notice =
        result === "added"
          ? "A group member's votes were merged from the invite link."
          : result === "duplicate"
            ? "Those votes were already merged — nothing changed."
            : "That's your own vote link — your votes are already counted.";
    }
    router.replace(`${pathname}?r=${encodeURIComponent(rParam ?? "")}`, { scroll: false });
    const timer = window.setTimeout(() => {
      setMergeNotice(notice);
      setInbox(getInbox(roomId));
    }, 0);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const myVotes = mine?.votes ?? {};

  const voters = useMemo<VoterRecord[]>(() => {
    const list: VoterRecord[] = [];
    if (mine && Object.keys(mine.votes).length > 0) {
      list.push({ vid: mine.vid, votes: mine.votes });
    }
    for (const entry of inbox) {
      if (Object.keys(entry.votes).length > 0) {
        list.push({ vid: entry.vid, votes: entry.votes });
      }
    }
    return list;
  }, [mine, inbox]);

  const voterCount = voters.length;
  const consensus = useMemo(
    () => (room ? computeConsensus(room, voters) : null),
    [room, voters],
  );
  const winners = useMemo(() => (room ? consensusWinners(room, voters) : {}), [room, voters]);
  const matches = useMemo(() => matchPackages(winners, 3), [winners]);

  const inviteUrl = useMemo(() => {
    if (typeof window === "undefined" || !rParam) return "";
    return `${window.location.origin}/trip-room/${roomId}?r=${rParam}`;
  }, [roomId, rParam]);

  const castVote = (category: PollCategory, option: string) => {
    if (myVotes[category] === option) return;
    const vid = saveMyVote(roomId, category, option);
    setMine({ vid, votes: { ...myVotes, [category]: option } });
    trackEvent("trip_room_vote", { room_id: roomId, category });
  };

  const handleCopyInvite = async () => {
    if (!inviteUrl) return;
    const ok = await copyText(inviteUrl);
    if (ok) {
      setCopied("invite");
      trackEvent("trip_room_invite", { room_id: roomId });
      window.setTimeout(() => setCopied((c) => (c === "invite" ? null : c)), 2000);
    }
  };

  const handleShareVotes = async () => {
    const current = getMyVotes(roomId);
    if (!current || Object.keys(current.votes).length === 0) return;
    const encoded = encodeSharedVotes({ vid: current.vid, votes: current.votes });
    if (!encoded || !inviteUrl) return;
    const ok = await copyText(`${inviteUrl}&v=${encoded}`);
    if (ok) {
      setCopied("votes");
      window.setTimeout(() => setCopied((c) => (c === "votes" ? null : c)), 2000);
    }
  };

  const handleEnquire = (slug: string) => {
    try {
      const summary = {
        roomId,
        destination: winners.destination ?? "",
        dates: winners.dates ?? "",
        budget: winners.budget ?? "",
        partySize: voterCount,
      };
      sessionStorage.setItem("mqt-room", JSON.stringify(summary));
    } catch {
      // Storage blocked — the enquiry page still works without the summary.
    }
    router.push(`/packages/${slug}#enquiry-form`);
  };

  if (room === null) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-extrabold text-ink">This trip room link doesn&apos;t look right</h1>
        <p className="mt-3 text-ink-muted">
          The room details in the URL are missing or damaged. Ask the room creator for a fresh invite link,
          or start your own room.
        </p>
        <Link
          href="/trip-room"
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-brand-cta px-6 py-3 font-extrabold text-brand-primary-deep"
        >
          Create a trip room
        </Link>
      </div>
    );
  }

  if (!consensus) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6" aria-busy="true">
        <div className="h-8 w-2/3 animate-pulse rounded-lg bg-surface-card" />
        <div className="mt-4 h-4 w-full animate-pulse rounded-lg bg-surface-card" />
        <div className="mt-2 h-4 w-5/6 animate-pulse rounded-lg bg-surface-card" />
      </div>
    );
  }

  const myVoteCount = Object.keys(myVotes).length;

  return (
    <div className="bg-surface-canvas">
      {/* Header */}
      <div className="border-b border-line bg-surface-card">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-secondary">
            Group trip room
          </p>
          <h1 className="mt-1 text-2xl font-extrabold text-ink sm:text-3xl">{room.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary px-3 py-1.5 text-sm font-bold text-white">
              <Users className="h-4 w-4" aria-hidden="true" />
              {voterCount} {voterCount === 1 ? "vote" : "votes"} merged
            </span>
            {myVoteCount > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-secondary/10 px-3 py-1.5 text-sm font-semibold text-brand-secondary">
                <Check className="h-4 w-4" aria-hidden="true" />
                You voted in {myVoteCount} of {POLL_CATEGORIES.length}
              </span>
            )}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-ink-muted">{SYNC_NOTE}</p>
          {mergeNotice && (
            <p role="status" className="mt-3 rounded-xl border border-brand-secondary/30 bg-brand-secondary/10 px-3 py-2 text-sm font-semibold text-brand-secondary">
              {mergeNotice}
            </p>
          )}
          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={handleCopyInvite}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-brand-primary px-4 py-2.5 text-sm font-extrabold text-brand-primary transition-colors hover:bg-brand-primary hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary"
            >
              {copied === "invite" ? <Check className="h-4 w-4" aria-hidden="true" /> : <Link2 className="h-4 w-4" aria-hidden="true" />}
              {copied === "invite" ? "Invite link copied!" : "Copy invite link"}
            </button>
            <button
              type="button"
              onClick={handleShareVotes}
              disabled={myVoteCount === 0}
              title={myVoteCount === 0 ? "Vote first, then share your votes" : "Copy a link carrying your votes"}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-2.5 text-sm font-extrabold text-white transition-transform hover:scale-[1.01] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-secondary active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              {copied === "votes" ? <Check className="h-4 w-4" aria-hidden="true" /> : <Share2 className="h-4 w-4" aria-hidden="true" />}
              {copied === "votes" ? "Vote link copied!" : "Share my votes"}
            </button>
          </div>
          {myVoteCount === 0 && (
            <p className="mt-2 text-xs text-ink-muted">Vote below first — then you can share your votes with the group.</p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {/* Your vote */}
        <section aria-labelledby="your-vote-heading">
          <h2 id="your-vote-heading" className="text-xl font-extrabold text-ink">Your vote</h2>
          <p className="mt-1 text-sm text-ink-muted">Pick one option per category. You can change your mind anytime.</p>
          <div className="mt-4 space-y-4">
            {POLL_CATEGORIES.map((cat) => (
              <fieldset key={cat} className="rounded-2xl border border-line bg-surface-card p-4 sm:p-5">
                <legend className="px-1 text-sm font-extrabold uppercase tracking-[0.14em] text-ink">
                  {CATEGORY_LABELS[cat]}
                </legend>
                <div className="flex flex-wrap gap-2">
                  {room.options[cat].map((option) => {
                    const checked = myVotes[cat] === option;
                    return (
                      <label
                        key={option}
                        className={`cursor-pointer rounded-full border px-3.5 py-2 text-sm font-semibold transition-all focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand-secondary ${
                          checked
                            ? "border-brand-secondary bg-brand-secondary text-white"
                            : "border-line bg-surface-canvas text-ink hover:border-brand-secondary/60"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`vote-${roomId}-${cat}`}
                          value={option}
                          checked={checked}
                          onChange={() => castVote(cat, option)}
                          className="sr-only"
                        />
                        {option}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>
        </section>

        {/* Consensus */}
        <section aria-labelledby="consensus-heading" className="mt-10">
          <h2 id="consensus-heading" className="text-xl font-extrabold text-ink">Group consensus</h2>
          <p className="mt-1 text-sm text-ink-muted">
            Computed from the {voterCount} {voterCount === 1 ? "vote" : "votes"} merged on this device.
          </p>
          <div className="mt-4 space-y-4">
            {POLL_CATEGORIES.map((cat) => (
              <ConsensusBars
                key={cat}
                label={CATEGORY_LABELS[cat]}
                rows={consensus[cat]}
                voterCount={voterCount}
                myChoice={myVotes[cat] ?? null}
              />
            ))}
          </div>
        </section>

        {/* Matches */}
        <section aria-labelledby="matches-heading" className="mt-10">
          <h2 id="matches-heading" className="text-xl font-extrabold text-ink">Best package matches</h2>
          {voterCount === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-line bg-surface-card p-6 text-center">
              <Copy className="mx-auto h-8 w-8 text-ink-muted" aria-hidden="true" />
              <p className="mt-3 font-bold text-ink">No votes yet — no matches to show</p>
              <p className="mt-1 text-sm text-ink-muted">
                Copy the invite link above and send it to your group. Matches appear as soon as the first vote lands.
              </p>
            </div>
          ) : matches.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-line bg-surface-card p-6">
              <p className="font-bold text-ink">No packages match this combination yet</p>
              <p className="mt-1 text-sm text-ink-muted">
                Try widening the destination or duration votes — the catalog may not cover this exact mix.
              </p>
            </div>
          ) : (
            <>
              <p className="mt-1 text-sm text-ink-muted">
                Real packages from our catalog, ranked by how well they fit the group&apos;s leading picks.
              </p>
              <div className="mt-4 space-y-4">
                {matches.map((match, i) => (
                  <MatchCard key={match.pkg.slug} match={match} rank={i + 1} onEnquire={(pkg) => handleEnquire(pkg.slug)} />
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
