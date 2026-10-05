// 라이선스(체험판 / 정품키).
//  - 체험판: 처음 실행한 날부터 5개월 (원본 TrialManager 와 같은 규칙: 시계를 되감으면 무효)
//  - 정품키: 이름과 만료일이 들어 있고 ECDSA(P-256) 서명이 붙은 문자열. 앱에는 공개키만 들어 있어 키를 위조할 수 없다.
// 이 검사는 브라우저에서 돌아가므로 "정직한 사용자용" 수준이다. (코드를 고치거나 저장소를 지우는 것까지 막지는 못한다)

export const TRIAL_MONTHS = 5;
export const KEY_PREFIX = "GMR1-";

export interface PublicJwk { kty: "EC"; crv: "P-256"; x: string; y: string }

export interface LicenseInfo { name: string; expires: string | null }   // expires: "YYYY-MM-DD" 또는 null(기한 없음)

export type KeyCheck =
  | { ok: true; info: LicenseInfo }
  | { ok: false; reason: "format" | "signature" | "expired"; info?: LicenseInfo };

export type LicenseState =
  | { kind: "licensed"; info: LicenseInfo }
  | { kind: "trial"; daysLeft: number; expiresOn: string }
  | { kind: "expired"; expiredOn: string; keyProblem?: "expired" };

export interface KeyValueStorage {
  getItem(k: string): string | null;
  setItem(k: string, v: string): void;
}

// ---------------------------------------------------------------- 날짜 (시계에 적힌 연월일 그대로)
export function todayString(d: Date = new Date()): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

function parseYmd(s: string): { y: number; m: number; d: number } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s);
  if (!m) return null;
  const y = +m[1], mo = +m[2], d = +m[3];
  const probe = new Date(Date.UTC(y, mo - 1, d));
  if (probe.getUTCFullYear() !== y || probe.getUTCMonth() !== mo - 1 || probe.getUTCDate() !== d) return null;
  return { y, m: mo, d };
}

const dayNumber = (s: string): number => {
  const p = parseYmd(s)!;
  return Math.round(Date.UTC(p.y, p.m - 1, p.d) / 86400000);
};

/** C# DateTime.AddMonths 와 같다: 도착한 달에 그 날짜가 없으면 그 달의 마지막 날 */
export function addMonths(s: string, n: number): string {
  const p = parseYmd(s)!;
  const total = p.y * 12 + (p.m - 1) + n;
  const y = Math.floor(total / 12), m = (total % 12) + 1;
  const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return `${String(y).padStart(4, "0")}-${String(m).padStart(2, "0")}-${String(Math.min(p.d, last)).padStart(2, "0")}`;
}

// ---------------------------------------------------------------- 체험판
const TRIAL_KEY = "gimun.t";
const XOR = 0x5a;

function encode(s: string): string {
  let out = "";
  for (let i = 0; i < s.length; i++) out += String.fromCharCode(s.charCodeAt(i) ^ XOR);
  return btoa(out);
}
function decode(s: string): string | null {
  try {
    const raw = atob(s);
    let out = "";
    for (let i = 0; i < raw.length; i++) out += String.fromCharCode(raw.charCodeAt(i) ^ XOR);
    return out;
  } catch {
    return null;
  }
}

export interface TrialStatus { valid: boolean; expiresOn: string; daysLeft: number; recorded: boolean }

/** 체험 기간을 확인하고, 처음이면 오늘을 시작일로 기록한다. */
export function checkTrial(st: KeyValueStorage | null, today: string = todayString()): TrialStatus {
  let first = today;
  let last: string | null = null;
  let recorded = true;
  try {
    const raw = st?.getItem(TRIAL_KEY);
    const txt = raw ? decode(raw) : null;
    const m = txt ? /^(\d{4}-\d{2}-\d{2})\|(\d{4}-\d{2}-\d{2})$/.exec(txt) : null;
    if (m && parseYmd(m[1]) && parseYmd(m[2])) { first = m[1]; last = m[2]; }
  } catch { recorded = false; }

  const expiresOn = addMonths(first, TRIAL_MONTHS);

  // 시계를 되감았으면(오늘이 마지막으로 확인한 날보다 이전) 무효
  if (last && dayNumber(today) < dayNumber(last)) {
    return { valid: false, expiresOn, daysLeft: 0, recorded };
  }
  try {
    if (!st) recorded = false;
    else st.setItem(TRIAL_KEY, encode(`${first}|${today}`));
  } catch { recorded = false; }

  const daysLeft = Math.max(0, dayNumber(expiresOn) - dayNumber(today));
  return { valid: dayNumber(today) <= dayNumber(expiresOn), expiresOn, daysLeft, recorded };
}

// ---------------------------------------------------------------- 정품키
function b64urlToBytes(s: string): Uint8Array<ArrayBuffer> {
  const b = atob(s.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - (s.length % 4)) % 4));
  const out = new Uint8Array(new ArrayBuffer(b.length));
  for (let i = 0; i < b.length; i++) out[i] = b.charCodeAt(i);
  return out;
}
export function bytesToB64url(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** 붙여넣은 키의 공백, 줄바꿈 제거 */
export function normalizeKey(s: string): string {
  return s.replace(/\s+/g, "");
}

/** 키를 검사한다. publicJwk 는 발급 도구가 만든 공개키. today 는 시험용으로 바꿀 수 있다. */
export async function verifyKey(key: string, publicJwk: PublicJwk, today: string = todayString()): Promise<KeyCheck> {
  const k = normalizeKey(key);
  if (!k.startsWith(KEY_PREFIX)) return { ok: false, reason: "format" };
  const parts = k.slice(KEY_PREFIX.length).split(".");
  if (parts.length !== 2) return { ok: false, reason: "format" };

  let payload: Uint8Array<ArrayBuffer>, sig: Uint8Array<ArrayBuffer>;
  try { payload = b64urlToBytes(parts[0]); sig = b64urlToBytes(parts[1]); } catch { return { ok: false, reason: "format" }; }
  if (sig.length !== 64) return { ok: false, reason: "format" };

  let valid = false;
  try {
    const pub = await crypto.subtle.importKey("jwk", publicJwk, { name: "ECDSA", namedCurve: "P-256" }, false, ["verify"]);
    valid = await crypto.subtle.verify({ name: "ECDSA", hash: "SHA-256" }, pub, sig, payload);
  } catch { valid = false; }
  if (!valid) return { ok: false, reason: "signature" };

  let info: LicenseInfo;
  try {
    const j = JSON.parse(new TextDecoder().decode(payload));
    if (j.v !== 1 || typeof j.n !== "string") throw new Error("bad");
    if (j.e !== undefined && (typeof j.e !== "string" || !parseYmd(j.e))) throw new Error("bad");
    info = { name: j.n, expires: j.e ?? null };
  } catch { return { ok: false, reason: "format" }; }

  if (info.expires && dayNumber(today) > dayNumber(info.expires)) return { ok: false, reason: "expired", info };
  return { ok: true, info };
}

// ---------------------------------------------------------------- 전체 상태
const KEY_STORE = "gimun.k";

export function loadStoredKey(st: KeyValueStorage | null): string | null {
  try { return st?.getItem(KEY_STORE) ?? null; } catch { return null; }
}
export function storeKey(st: KeyValueStorage | null, key: string): boolean {
  try { if (!st) return false; st.setItem(KEY_STORE, normalizeKey(key)); return true; } catch { return false; }
}

/** 지금 상태: 정품 / 체험 중 / 만료 */
export async function currentState(st: KeyValueStorage | null, publicJwk: PublicJwk, today: string = todayString()): Promise<LicenseState> {
  const stored = loadStoredKey(st);
  let keyProblem: "expired" | undefined;
  if (stored) {
    const c = await verifyKey(stored, publicJwk, today);
    if (c.ok) return { kind: "licensed", info: c.info };
    if (c.reason === "expired") keyProblem = "expired";
  }
  const t = checkTrial(st, today);
  if (t.valid) return { kind: "trial", daysLeft: t.daysLeft, expiresOn: t.expiresOn };
  return { kind: "expired", expiredOn: t.expiresOn, keyProblem };
}

export function describeState(s: LicenseState): string {
  if (s.kind === "licensed") return `정품 · ${s.info.name}` + (s.info.expires ? ` · ${s.info.expires}까지` : "");
  if (s.kind === "trial") return `체험판 · ${s.daysLeft}일 남음 (${s.expiresOn}까지)`;
  return "사용기한이 만료되었습니다";
}
