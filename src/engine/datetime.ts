// C# DateTime 대신 쓰는 아주 작은 날짜 도구.
// 시각은 "밀리초 숫자"(Dt)로 다루며, 시간대/서머타임 없이 시계에 적힌 그대로(UTC 로 취급) 계산한다.
// (사주는 입력한 시계 시각 그대로 쓰므로 브라우저 시간대의 영향을 받으면 안 된다)

export type Dt = number;

const MS_DAY = 86400000;

export function mk(y: number, m: number, d: number, h = 0, mi = 0, s = 0, ms = 0): Dt {
  const t = new Date(0);
  t.setUTCFullYear(y, m - 1, d);
  t.setUTCHours(h, mi, s, ms);
  return t.getTime();
}

const dd = (t: Dt) => new Date(t);
export const year = (t: Dt) => dd(t).getUTCFullYear();
export const month = (t: Dt) => dd(t).getUTCMonth() + 1;
export const day = (t: Dt) => dd(t).getUTCDate();
export const hour = (t: Dt) => dd(t).getUTCHours();
export const minute = (t: Dt) => dd(t).getUTCMinutes();
export const second = (t: Dt) => dd(t).getUTCSeconds();

/** 그 해의 몇 번째 날인지 (1월 1일 = 1) */
export function dayOfYear(t: Dt): number {
  return Math.floor((dateOnly(t) - mk(year(t), 1, 1)) / MS_DAY) + 1;
}

/** 시각을 버린 날짜 (그날 0시) */
export function dateOnly(t: Dt): Dt {
  return Math.floor(t / MS_DAY) * MS_DAY;
}

/** 그날 0시부터 지난 분 (소수 포함) */
export function minutesOfDay(t: Dt): number {
  return (t - dateOnly(t)) / 60000;
}

export const addDays = (t: Dt, n: number): Dt => t + n * MS_DAY;
export const addHours = (t: Dt, n: number): Dt => t + n * 3600000;
export const addMinutes = (t: Dt, n: number): Dt => t + n * 60000;

/** C# DateTime.AddYears 와 같다. 2월 29일이 없는 해로 가면 2월 28일이 된다. */
export function addYears(t: Dt, n: number): Dt {
  const y = year(t) + n, m = month(t);
  const lastDay = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const d = Math.min(day(t), lastDay);
  return mk(y, m, d, hour(t), minute(t), second(t), t - Math.floor(t / 1000) * 1000);
}

/** C# TimeSpan.FromSeconds(double) 은 밀리초로 반올림한다(.NET Framework). */
export function secondsToMs(sec: number): number {
  return Math.trunc(sec * 1000 + (sec >= 0 ? 0.5 : -0.5));
}

/** C# Math.Round(double): 정확히 .5 일 때 짝수로 (JS Math.round 와 다름) */
export function roundHalfEven(x: number): number {
  const f = Math.floor(x);
  const diff = x - f;
  if (diff < 0.5) return f;
  if (diff > 0.5) return f + 1;
  return f % 2 === 0 ? f : f + 1;
}

const p2 = (n: number) => (n < 10 ? "0" + n : "" + n);

/** "yyyy년 MM월 dd일 HH:mm" */
export function fmtKo(t: Dt): string {
  return `${year(t)}년 ${p2(month(t))}월 ${p2(day(t))}일 ${p2(hour(t))}:${p2(minute(t))}`;
}

/** 시험/디버그용: "yyyy-MM-ddTHH:mm:ss.fff" */
export function fmtIso(t: Dt): string {
  const d = dd(t);
  const ms = d.getUTCMilliseconds();
  return `${d.getUTCFullYear()}-${p2(d.getUTCMonth() + 1)}-${p2(d.getUTCDate())}T${p2(d.getUTCHours())}:${p2(d.getUTCMinutes())}:${p2(d.getUTCSeconds())}.${ms < 10 ? "00" + ms : ms < 100 ? "0" + ms : ms}`;
}

/** "yyyy-MM-dd[THH:mm:ss[.fff]]" -> Dt */
export function parseIso(s: string): Dt {
  const m = /^(\d{4})-(\d\d)-(\d\d)(?:T(\d\d):(\d\d):(\d\d)(?:\.(\d+))?)?$/.exec(s);
  if (!m) throw new Error("bad date: " + s);
  return mk(+m[1], +m[2], +m[3], +(m[4] ?? 0), +(m[5] ?? 0), +(m[6] ?? 0), m[7] ? +(m[7] + "00").slice(0, 3) : 0);
}

/** 브라우저 Date(사용자 시계 기준) -> Dt : 화면에 보이는 연월일시분을 그대로 옮긴다 */
export function fromLocalDate(d: Date): Dt {
  return mk(d.getFullYear(), d.getMonth() + 1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds());
}
