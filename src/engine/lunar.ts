// 한국 음력 <-> 양력 변환. C# 의 KoreanLunisolarCalendar 를 대신하는 달력표 방식.
// 표(lunarTable.json)는 tools/EngineDump 로 .NET 에서 뽑은 것이며, 1850~2050년을 담고 있다.
import table from "./lunarTable.json";
import { Dt, mk, dateOnly, parseIso, year as yearOf } from "./datetime";

interface Row {
  year: number;
  months: number;      // 12 또는 13 (윤달이 있는 해)
  leapMonth: number;   // .NET 달 번호 기준의 윤달 위치(1~13), 윤달이 없으면 0
  days: number[];      // 달 번호(.NET 기준)별 일수
  newYear: Dt;         // 음력 1월 1일의 양력 날짜
}

const MS_DAY = 86400000;
const rows = new Map<number, Row>();
for (const r of table as { year: number; months: number; leapMonth: number; days: number[]; newYear: string }[])
  rows.set(r.year, { ...r, newYear: parseIso(r.newYear) });

const MAX_SOLAR = mk(2050, 2, 10);   // KoreanLunisolarCalendar 가 지원하는 마지막 날

function rowOf(y: number): Row {
  const r = rows.get(y);
  if (!r) throw new RangeError("음력 표에 없는 해: " + y);
  return r;
}

export interface LunarDate {
  ly: boolean;      // 윤달 여부
  year: number;
  month: number;    // 윤달은 앞 달과 같은 번호(예: 윤5월 -> 5)
  day: number;
}

/** 양력 -> 음력 (ToLunarDate) */
export function toLunarDate(solar: Dt): LunarDate {
  const date = dateOnly(solar);
  if (date > MAX_SOLAR) throw new RangeError("지원하지 않는 날짜");
  let y = Math.min(yearOf(date) + 1, 2050);                // 음력 연도는 양력 연도 또는 그 전해
  while (y > 1850 && rowOf(y).newYear > date) y--;
  const r = rowOf(y);
  if (r.newYear > date) throw new RangeError("지원하지 않는 날짜");
  let offset = Math.round((date - r.newYear) / MS_DAY);
  let idx = 0;
  while (idx < r.months && offset >= r.days[idx]) { offset -= r.days[idx]; idx++; }
  if (idx >= r.months) throw new RangeError("지원하지 않는 날짜");

  let m = idx + 1;                          // .NET 의 달 번호 (윤달 포함 1~13)
  const ly = r.months > 12 && m === r.leapMonth;
  if (r.months > 12 && m >= r.leapMonth) m--;
  return { ly, year: y, month: m, day: offset + 1 };
}

/** 음력 -> 양력 (ToSolarDate). 윤달은 isLeap 로 표시 */
export function toSolarDate(y: number, m: number, d: number, isLeap: boolean, hour: number, min: number): Dt {
  const r = rowOf(y);
  if (r.months > 12) {
    const leap = r.leapMonth;
    if (m > leap - 1) m++;
    else if (m === leap - 1 && isLeap) m++;
  }
  if (m < 1 || m > r.months || d < 1 || d > r.days[m - 1]) throw new RangeError("없는 음력 날짜");
  let off = d - 1;
  for (let i = 0; i < m - 1; i++) off += r.days[i];
  return r.newYear + off * MS_DAY + hour * 3600000 + min * 60000;
}

/** 그 해 음력의 달 수 (12 또는 13) */
export function monthsInYear(y: number): number { return rowOf(y).months; }
/** 그 해 윤달의 .NET 달 번호 (없으면 0) */
export function leapMonthOf(y: number): number { return rowOf(y).leapMonth; }
/** .NET 달 번호 기준 그 달의 일수 */
export function daysInMonth(y: number, m: number): number {
  const r = rowOf(y);
  if (m < 1 || m > r.months) throw new RangeError("없는 달");
  return r.days[m - 1];
}
