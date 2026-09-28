/**
 * Group Trip Room — local vote storage and consensus computation.
 *
 * No backend: each member's votes live in their own browser.
 * - `mine`   — this device's own votes (one voter).
 * - `inbox`  — vote records received by opening ?v= share links.
 *
 * Merging is deduped by voter id, so re-opening the same share link never
 * double-counts a vote. Everything is honest: the voter count is exactly
 * the number of merged vote records.
 */

"use client";

import { newVoterId } from "./codec";
import {
  POLL_CATEGORIES,
  type CategoryVotes,
  type PollCategory,
  type RoomState,
  type SharedVotes,
  type StoredInboxEntry,
  type StoredMine,
  type VoterRecord,
} from "./types";

const mineKey = (roomId: string) => `mqt-trip-room:mine:${roomId}`;
const inboxKey = (roomId: string) => `mqt-trip-room:inbox:${roomId}`;
const MAX_INBOX_ENTRIES = 50;

function storageAvailable(): boolean {
  try {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
  } catch {
    return false;
  }
}

function readJson<T>(key: string): T | null {
  if (!storageAvailable()) return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  if (!storageAvailable()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or blocked — votes simply won't persist; UI still works.
  }
}

/** This device's own vote record, if any. */
export function getMyVotes(roomId: string): StoredMine | null {
  const mine = readJson<StoredMine>(mineKey(roomId));
  if (!mine || typeof mine.vid !== "string" || typeof mine.votes !== "object" || mine.votes === null) {
    return null;
  }
  return mine;
}

/** Save (or update) this device's votes for one category. Returns the voter id. */
export function saveMyVote(roomId: string, category: PollCategory, option: string): string {
  const existing = getMyVotes(roomId);
  const vid = existing?.vid ?? newVoterId();
  const votes: CategoryVotes = { ...(existing?.votes ?? {}), [category]: option };
  writeJson(mineKey(roomId), { vid, votes } satisfies StoredMine);
  return vid;
}

/** Vote records received from ?v= share links. */
export function getInbox(roomId: string): StoredInboxEntry[] {
  const inbox = readJson<StoredInboxEntry[]>(inboxKey(roomId));
  return Array.isArray(inbox) ? inbox : [];
}

export type MergeResult = "added" | "duplicate" | "self";

/**
 * Merge a vote record received from a ?v= link into this device's inbox.
 * - "self": it is this device's own share link — not double counted.
 * - "duplicate": this exact voter was already merged — not counted again.
 * - "added": a new voter merged.
 */
export function mergeSharedVotes(roomId: string, shared: SharedVotes): MergeResult {
  const mine = getMyVotes(roomId);
  if (mine && shared.vid === mine.vid) return "self";
  const inbox = getInbox(roomId);
  if (inbox.some((entry) => entry.vid === shared.vid)) return "duplicate";
  inbox.push({ vid: shared.vid, votes: shared.votes, at: Date.now() });
  writeJson(inboxKey(roomId), inbox.slice(-MAX_INBOX_ENTRIES));
  return "added";
}

/** All voters participating in consensus: me (if I voted) + merged shares. */
export function getAllVoters(roomId: string): VoterRecord[] {
  const voters: VoterRecord[] = [];
  const mine = getMyVotes(roomId);
  if (mine && Object.keys(mine.votes).length > 0) {
    voters.push({ vid: mine.vid, votes: mine.votes });
  }
  for (const entry of getInbox(roomId)) {
    if (Object.keys(entry.votes).length > 0) {
      voters.push({ vid: entry.vid, votes: entry.votes });
    }
  }
  return voters;
}

/** Honest voter count: exactly the merged vote records on this device. */
export function getVoterCount(roomId: string): number {
  return getAllVoters(roomId).length;
}

export interface CategoryConsensus {
  option: string;
  votes: number;
  /** Share of voters who answered this category, rounded. */
  pct: number;
}

/**
 * Per-category consensus over the room's options. Options a voter chose that
 * are no longer in the room's option list are ignored. Zero voters -> 0% rows.
 */
export function computeConsensus(
  room: RoomState,
  voters: VoterRecord[],
): Record<PollCategory, CategoryConsensus[]> {
  const out = {} as Record<PollCategory, CategoryConsensus[]>;
  for (const cat of POLL_CATEGORIES) {
    const options = room.options[cat];
    const tally = new Map<string, number>();
    let answered = 0;
    for (const voter of voters) {
      const choice = voter.votes[cat];
      if (choice && options.includes(choice)) {
        tally.set(choice, (tally.get(choice) ?? 0) + 1);
        answered++;
      }
    }
    out[cat] = options
      .map((option) => {
        const votes = tally.get(option) ?? 0;
        return { option, votes, pct: answered === 0 ? 0 : Math.round((votes / answered) * 100) };
      })
      .sort((a, b) => b.votes - a.votes || a.option.localeCompare(b.option));
  }
  return out;
}

/** Leading option per category (null when nobody has voted for it yet). */
export function consensusWinners(
  room: RoomState,
  voters: VoterRecord[],
): Partial<Record<PollCategory, string>> {
  const consensus = computeConsensus(room, voters);
  const winners: Partial<Record<PollCategory, string>> = {};
  for (const cat of POLL_CATEGORIES) {
    const top = consensus[cat][0];
    if (top && top.votes > 0) winners[cat] = top.option;
  }
  return winners;
}
