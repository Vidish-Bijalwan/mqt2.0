/**
 * Voucher wallet — this device's won vouchers, persisted in localStorage.
 *
 * Deliberately separate from src/lib/games/gameEngine.ts: the wallet only
 * STORES vouchers the engine already awarded. It never decides, alters, or
 * re-rolls prizes. The engine + prize config stay the single source of
 * truth for odds and compliance.
 */

export interface StoredVoucher {
  /** MQT-XXXX-XXXX code issued at win time. */
  code: string;
  /** PrizeTier id, e.g. "kedarnath-trail". */
  tierId: string;
  /** Display label, e.g. "₹500 travel voucher". */
  label: string;
  /** Rupee value. */
  value: number;
  /** Minimum qualifying booking value (₹). */
  minSpend: number;
  /** ISO timestamp of the win. */
  issuedAtIso: string;
  /** ISO timestamp of voucher expiry. */
  expiresAtIso: string;
}

export const WALLET_STORAGE_KEY = "mqt-voucher-wallet:v1";

/** Max vouchers kept per device (oldest-first eviction beyond this). */
const MAX_STORED = 50;

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

function readRaw(storage: StorageLike): StoredVoucher[] {
  try {
    const raw = storage.getItem(WALLET_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (v): v is StoredVoucher =>
        typeof v === "object" &&
        v !== null &&
        typeof (v as StoredVoucher).code === "string" &&
        typeof (v as StoredVoucher).value === "number",
    );
  } catch {
    return [];
  }
}

/** All stored vouchers, newest first. Never throws. */
export function loadWallet(storage: StorageLike): StoredVoucher[] {
  return readRaw(storage).sort((a, b) =>
    b.issuedAtIso.localeCompare(a.issuedAtIso),
  );
}

/**
 * Store a newly won voucher. Idempotent on `code` (a double-render can't
 * duplicate it). Returns the updated wallet, newest first.
 */
export function saveVoucher(
  storage: StorageLike,
  voucher: StoredVoucher,
): StoredVoucher[] {
  try {
    const existing = readRaw(storage);
    if (!existing.some((v) => v.code === voucher.code)) {
      existing.push(voucher);
    }
    // Oldest-first eviction beyond the cap (keeps newest MAX_STORED).
    const trimmed = existing
      .sort((a, b) => a.issuedAtIso.localeCompare(b.issuedAtIso))
      .slice(-MAX_STORED);
    storage.setItem(WALLET_STORAGE_KEY, JSON.stringify(trimmed));
    notifyWalletUpdated();
    return loadWallet(storage);
  } catch {
    return loadWallet(storage);
  }
}

/** Vouchers still valid at `nowIso` (expiry is honest — expired ones drop out). */
export function activeVouchers(
  wallet: StoredVoucher[],
  nowIso: string,
): StoredVoucher[] {
  return wallet.filter((v) => v.expiresAtIso > nowIso);
}

/** Total rupee value of active vouchers. */
export function walletTotalValue(wallet: StoredVoucher[]): number {
  const now = new Date().toISOString();
  return activeVouchers(wallet, now).reduce((s, v) => s + v.value, 0);
}

/**
 * React integration for the wallet.
 *
 * `useSyncExternalStore(subscribeWallet, getWalletSnapshot,
 * getWalletServerSnapshot)` gives components a live view of the wallet:
 * same-tab saves dispatch an event, other tabs arrive via the storage
 * event, and returning to the tab refreshes on focus. Snapshots are cached
 * by raw localStorage value so the getter stays referentially stable.
 */
export const WALLET_UPDATED_EVENT = "mqt:voucher-wallet-updated";

let snapshotCache: { raw: string | null; parsed: StoredVoucher[] } | null = null;

function readSnapshot(): StoredVoucher[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(WALLET_STORAGE_KEY);
  if (snapshotCache && snapshotCache.raw === raw) return snapshotCache.parsed;
  const parsed = loadWallet(window.localStorage);
  snapshotCache = { raw, parsed };
  return parsed;
}

function notifyWalletUpdated(): void {
  snapshotCache = null;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(WALLET_UPDATED_EVENT));
  }
}

export function subscribeWallet(onChange: () => void): () => void {
  const refresh = () => {
    snapshotCache = null;
    onChange();
  };
  const onStorage = (e: StorageEvent) => {
    if (e.key === WALLET_STORAGE_KEY) refresh();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(WALLET_UPDATED_EVENT, refresh);
  window.addEventListener("focus", refresh);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(WALLET_UPDATED_EVENT, refresh);
    window.removeEventListener("focus", refresh);
  };
}

export function getWalletSnapshot(): StoredVoucher[] {
  return readSnapshot();
}

export function getWalletServerSnapshot(): StoredVoucher[] {
  return [];
}
