/**
 * Group Trip Room — shared types.
 *
 * There is no backend: room state lives in the URL (?r=base64url JSON),
 * each member's votes live in their own browser's localStorage, and shared
 * votes arrive via ?v= links that the opener's client merges locally.
 */

export const POLL_CATEGORIES = [
  "destination",
  "dates",
  "budget",
  "hotel",
  "activities",
  "duration",
] as const;

export type PollCategory = (typeof POLL_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<PollCategory, string> = {
  destination: "Destination",
  dates: "Travel dates",
  budget: "Budget per person",
  hotel: "Hotel level",
  activities: "Activities",
  duration: "Trip duration",
};

/** Codec version of the room-state payload. */
export const ROOM_CODEC_VERSION = 1;

/** The poll a room creator defines. Encoded into ?r=. */
export interface RoomState {
  v: typeof ROOM_CODEC_VERSION;
  /** Room display name (<=80 chars). */
  name: string;
  /** Poll options per category. */
  options: Record<PollCategory, string[]>;
}

/** One member's votes: chosen option per category (may be partial). */
export type CategoryVotes = Partial<Record<PollCategory, string>>;

/** Payload shared via ?v= links. */
export interface SharedVotes {
  /** Random 8-char voter id used to dedupe repeated opens of the same link. */
  vid: string;
  votes: CategoryVotes;
}

/** This device's own vote record. */
export interface StoredMine {
  vid: string;
  votes: CategoryVotes;
}

/** One vote record received from a ?v= link. */
export interface StoredInboxEntry extends SharedVotes {
  at: number;
}

/** A voter that participates in consensus (mine + merged shares). */
export interface VoterRecord {
  vid: string;
  votes: CategoryVotes;
}
