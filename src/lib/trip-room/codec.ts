/**
 * Group Trip Room — base64url JSON codec for the URL payloads.
 *
 * - Room state (poll options) -> ?r=  (hard cap 2048 chars)
 * - Shared votes           -> ?v=  (hard cap 1024 chars)
 *
 * Encoding is URL-safe (base64url, no padding). All decodes are validated
 * back into shape — a malformed or tampered payload returns null instead of
 * throwing.
 */

import { OPTION_LIMITS } from "./options";
import {
  POLL_CATEGORIES,
  ROOM_CODEC_VERSION,
  type CategoryVotes,
  type PollCategory,
  type RoomState,
  type SharedVotes,
} from "./types";

/** Room payload (?r=) must stay under this many characters. */
export const MAX_ROOM_PAYLOAD_CHARS = 2048;
/** Shared-votes payload (?v=) must stay under this many characters. */
export const MAX_SHARED_VOTES_CHARS = 1024;

const MAX_ROOM_NAME_CHARS = 80;
const MAX_OPTION_CHARS = 60;
const VOTER_ID_RE = /^[a-z0-9]{8}$/;

function bytesToB64url(bytes: Uint8Array): string {
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlToBytes(s: string): Uint8Array | null {
  try {
    const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
    const pad = b64.length % 4;
    const bin = atob(b64 + (pad ? "=".repeat(4 - pad) : ""));
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  } catch {
    return null;
  }
}

function encodeJson(value: unknown): string {
  return bytesToB64url(new TextEncoder().encode(JSON.stringify(value)));
}

function decodeJson<T>(s: string): T | null {
  const bytes = b64urlToBytes(s);
  if (!bytes) return null;
  try {
    return JSON.parse(new TextDecoder().decode(bytes)) as T;
  } catch {
    return null;
  }
}

function isNonEmptyShortString(v: unknown, max: number): v is string {
  return typeof v === "string" && v.trim().length > 0 && v.length <= max;
}

function sanitizeVotes(raw: unknown): CategoryVotes | null {
  if (typeof raw !== "object" || raw === null) return null;
  const votes: CategoryVotes = {};
  for (const [key, value] of Object.entries(raw)) {
    if (!POLL_CATEGORIES.includes(key as PollCategory)) return null;
    if (!isNonEmptyShortString(value, MAX_OPTION_CHARS)) return null;
    votes[key as PollCategory] = value.trim();
  }
  return votes;
}

function sanitizeRoomState(raw: unknown): RoomState | null {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Record<string, unknown>;
  if (r.v !== ROOM_CODEC_VERSION) return null;
  if (!isNonEmptyShortString(r.name, MAX_ROOM_NAME_CHARS)) return null;
  if (typeof r.options !== "object" || r.options === null) return null;
  const opts = r.options as Record<string, unknown>;
  const options = {} as Record<PollCategory, string[]>;
  for (const cat of POLL_CATEGORIES) {
    const limits = OPTION_LIMITS[cat];
    const list = opts[cat];
    if (!Array.isArray(list) || list.length < limits.min || list.length > limits.max) return null;
    const cleaned: string[] = [];
    for (const item of list) {
      if (!isNonEmptyShortString(item, MAX_OPTION_CHARS)) return null;
      const trimmed = item.trim();
      if (cleaned.includes(trimmed)) return null; // no duplicate options
      cleaned.push(trimmed);
    }
    options[cat] = cleaned;
  }
  return { v: ROOM_CODEC_VERSION, name: (r.name as string).trim(), options };
}

/** Encode room state for ?r=. Returns null if invalid or over the size cap. */
export function encodeRoomState(state: RoomState): string | null {
  const clean = sanitizeRoomState(state);
  if (!clean) return null;
  const encoded = encodeJson(clean);
  return encoded.length <= MAX_ROOM_PAYLOAD_CHARS ? encoded : null;
}

/** Decode ?r=. Returns null for missing/invalid/oversized/tampered payloads. */
export function decodeRoomState(s: string | null | undefined): RoomState | null {
  if (!s || s.length > MAX_ROOM_PAYLOAD_CHARS) return null;
  if (!/^[A-Za-z0-9\-_]+$/.test(s)) return null;
  return sanitizeRoomState(decodeJson(s));
}

/** Encode a voter's votes for ?v=. Returns null if invalid or over the size cap. */
export function encodeSharedVotes(shared: SharedVotes): string | null {
  if (typeof shared !== "object" || shared === null) return null;
  if (!VOTER_ID_RE.test(shared.vid)) return null;
  const votes = sanitizeVotes(shared.votes);
  if (!votes || Object.keys(votes).length === 0) return null;
  const encoded = encodeJson({ vid: shared.vid, votes });
  return encoded.length <= MAX_SHARED_VOTES_CHARS ? encoded : null;
}

/** Decode ?v=. Returns null for missing/invalid/oversized/tampered payloads. */
export function decodeSharedVotes(s: string | null | undefined): SharedVotes | null {
  if (!s || s.length > MAX_SHARED_VOTES_CHARS) return null;
  if (!/^[A-Za-z0-9\-_]+$/.test(s)) return null;
  const parsed = decodeJson<{ vid: unknown; votes: unknown }>(s);
  if (!parsed || typeof parsed.vid !== "string" || !VOTER_ID_RE.test(parsed.vid)) return null;
  const votes = sanitizeVotes(parsed.votes);
  if (!votes || Object.keys(votes).length === 0) return null;
  return { vid: parsed.vid, votes };
}

/** Generate an 8-char lowercase-alphanumeric room id (client only). */
export function newRoomId(): string {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

/** Generate an 8-char voter id (client only). */
export function newVoterId(): string {
  return newRoomId();
}
