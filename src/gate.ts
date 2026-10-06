// 사용 허가 확인: 서비스가 살아 있는지 status.json 으로 확인한다.
// 확인에 성공한 시각을 기기에 저장하고, 오프라인이어도 마지막 성공 후 7일까지만 쓸 수 있다.
// 서버가 "중단"을 알리거나(active:false) 주소가 사라지면(404 등) 즉시 잠근다.
// 이 검사는 브라우저에서 실행되므로 코드를 고친 사본까지 막을 수는 없다.

export const GRACE_MS = 7 * 24 * 3600 * 1000;
const KEY = "gimun.lastOk";

export type GateState =
  | { ok: true; offline: boolean }
  | { ok: false; reason: "stopped" | "expired" | "never" };

/** 서버 응답(없으면 null=연결 실패)과 마지막 성공 시각으로 허용 여부를 결정한다. */
export function decide(
  res: { status: number; active?: boolean } | null,
  lastOk: number | null,
  now: number,
): GateState {
  if (res) {
    if (res.status >= 200 && res.status < 300) {
      return res.active === false ? { ok: false, reason: "stopped" } : { ok: true, offline: false };
    }
    if (res.status === 404 || res.status === 403 || res.status === 410) return { ok: false, reason: "stopped" };
    // 5xx 등 일시 장애는 오프라인과 같이 취급
  }
  if (lastOk == null) return { ok: false, reason: "never" };
  const age = now - lastOk;
  if (age < 0 || age > GRACE_MS) return { ok: false, reason: "expired" };   // 시계를 되돌린 경우도 만료
  return { ok: true, offline: true };
}

function readLast(): number | null {
  try {
    const v = Number(localStorage.getItem(KEY));
    return Number.isFinite(v) && v > 0 ? v : null;
  } catch { return null; }
}
function writeLast(v: number | null): void {
  try { if (v == null) localStorage.removeItem(KEY); else localStorage.setItem(KEY, String(v)); } catch { /* 저장 불가 */ }
}

export async function checkGate(): Promise<GateState> {
  const now = Date.now();
  let res: { status: number; active?: boolean } | null = null;
  try {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 8000);
    const r = await fetch(`status.json?t=${now}`, { cache: "no-store", signal: ctl.signal });
    clearTimeout(t);
    let active: boolean | undefined;
    if (r.ok) {
      try { active = (await r.json()).active !== false; } catch { active = undefined; }
    }
    res = { status: r.status, active };
  } catch { res = null; }

  const st = decide(res, readLast(), now);
  if (st.ok && !st.offline) writeLast(now);
  if (!st.ok && st.reason === "stopped") writeLast(null);
  return st;
}
