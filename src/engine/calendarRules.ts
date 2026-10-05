// 날짜/절기/간지 계산 (C# SajuEngine 의 dateAdjust, get24Terms, ToSaju*, getDirection, getohaeng_dt)
import {
  Dt, mk, year, month, day, hour, minute, dayOfYear, minutesOfDay, addHours, addMinutes, secondsToMs, roundHalfEven,
} from "./datetime";

const SUMMERTIME: [string, string][] = [
  ["194806010000", "194809130000"], ["194904030000", "194909110000"], ["195004010000", "195009100000"], ["195105060000", "195109090000"],
  ["195505050000", "195509090000"], ["195605200000", "195609300000"], ["195705050000", "195709220000"], ["195805040000", "195809210000"],
  ["195905030000", "195909200000"], ["196005010000", "196009180000"], ["198705100200", "198710110300"], ["198805080200", "198810090300"],
];
const SEOULTIME: [string, string][] = [["190802010000", "191112312359"], ["195403210000", "196108090000"]];

function parseYmdHm(s: string): Dt {
  return mk(+s.slice(0, 4), +s.slice(4, 6), +s.slice(6, 8), +s.slice(8, 10), +s.slice(10, 12));
}

/** 서머타임과 서울 표준시(127.5도) 보정 */
export function dateAdjust(dt: Dt): Dt {
  for (const [a, b] of SUMMERTIME) {
    if (dt >= parseYmdHm(a) && dt < parseYmdHm(b)) dt = addHours(dt, -1);
  }
  for (const [a, b] of SEOULTIME) {
    if (dt >= parseYmdHm(a) && dt < parseYmdHm(b)) dt = addMinutes(dt, 30);
  }
  return dt;
}

const TTERMS = [-6418939, -5146737, -3871136, -2589569, -1299777, 0, 1310827, 2633103, 3966413, 5309605, 6660762, 8017383,
  9376511, 10735018, 12089855, 13438199, 14777792, 16107008, 17424841, 18731368, 20027093, 21313452, 22592403, 23866369]; // 소한~동지까지 초단위 시간

// 1902년부터 년도별 오차 보정 테이블
const ADDSTIME: [number, number][] = [
  [1902, 1545], [1903, 1734], [1904, 1740], [1906, 475], [1907, 432],
  [1908, 480], [1909, 462], [1915, -370], [1916, -332], [1918, -335],
  [1919, -263], [1925, 340], [1927, 344], [1928, 2133], [1929, 2112],
  [1930, 2100], [1931, 1858], [1936, -400], [1937, -400], [1938, -342],
  [1939, -300], [1944, 365], [1945, 380], [1946, 400], [1947, 200],
  [1948, 244], [1953, -266], [1954, 2600], [1955, 3168], [1956, 3218],
  [1957, 3366], [1958, 3300], [1959, 3483], [1960, 2386], [1961, 3015],
  [1962, 2090], [1963, 2090], [1964, 2264], [1965, 2370], [1966, 2185],
  [1967, 2144], [1968, 1526], [1971, -393], [1972, -430], [1973, -445],
  [1974, -543], [1975, -393], [1980, 300], [1981, 490], [1982, 400],
  [1983, 445], [1984, 393], [1987, -1530], [1988, -1600], [1990, -362],
  [1991, -366], [1992, -400], [1993, -449], [1994, -321], [1995, -344],
  [1999, 356], [2000, 480], [2001, 483], [2002, 504], [2003, 294],
  [2007, -206], [2008, -314], [2009, -466], [2010, -416], [2011, -457],
  [2012, -313], [2018, 347], [2020, 257], [2021, 351], [2022, 159],
  [2023, 177], [2026, -134], [2027, -340], [2028, -382], [2029, -320],
  [2030, -470], [2031, -370], [2032, -373], [2036, 349], [2037, 523],
];

// 1902년부터 절기 보정 테이블: [연도, 절기번호, 보정초]
const ADDTTIME: [number, number, number][] = [
  [1919, 14, -160], [1939, 10, -508],
  [1953, 0, 220], [1954, 1, -2973],
  [1982, 18, 241], [1988, 13, -2455],
  [2013, 6, 356], [2031, 20, 411],
  [2023, 0, 399], [2023, 11, -571],
];

/** 그 해의 24절기(소한~동지) 시각 */
export function get24Terms(dt: Dt): Dt[] {
  const solarStart = mk(2000, 3, 20, 16, 35, 15);   // 2000년 춘분점 기준
  const solarTyear = 31556940;                      // 평균 태양년(초)
  const solarByear = 2000;
  const y = year(dt);
  const terms: Dt[] = [];
  for (let i = 0; i < 24; i++) {
    let time = (y - solarByear) * solarTyear;
    time += TTERMS[i];

    const D = (time + 6809779) / 86400;
    const g0 = 357.529 + 0.98560028 * D;
    const q0 = 280.459 + 0.98564736 * D;
    let g = g0 % 360; if (g < 0) g += 360;
    let q = q0 % 360; if (q < 0) q += 360;

    let L = q + 1.915 * Math.sin(g * Math.PI / 180) + 0.020 * Math.sin(2 * g * Math.PI / 180);
    L = L % 360; if (L < 0) L += 360;

    const aTIME = (roundHalfEven(L) - L) * 87658.1256;
    time += aTIME;

    for (const [yy, add] of ADDSTIME) if (y === yy) time += add;
    for (const [yy, idx, add] of ADDTTIME) if (y === yy && i === idx) time += add;

    terms.push(solarStart + secondsToMs(time));
  }
  return terms;
}

/** 양둔(true)/음둔(false) */
export function getDirection(dt: Dt, terms: Dt[]): boolean {
  let i: number;
  for (i = 0; i < 24 && dt >= terms[i]; i++);
  return i === 24 || i <= 11;
}

/** 날짜의 오행 (0:수, 1:목, 2:화, 3:토, 4:금) */
export function getohaeng_dt(dt: Dt): number {
  const m = month(dt), d = day(dt);
  if ((m === 2 && d >= 4) || m === 3 || (m === 4 && d < 17)) return 1;
  if ((m === 5 && d >= 5) || m === 6 || (m === 7 && d < 20)) return 2;
  if ((m === 8 && d >= 7) || m === 9 || (m === 10 && d < 20)) return 4;
  if ((m === 11 && d >= 7) || m === 12 || (m === 1 && d < 17)) return 0;
  return 3;
}

/** 년주 [천간, 지지] */
export function toSajuYear(dt: Dt, term: Dt): [number, number] {
  const y = dt >= term ? year(dt) : year(dt) - 1;
  return [(y + 6) % 10 + 1, (y + 8) % 12 + 1];
}

/** 월주 [천간, 지지] */
export function toSajuMonth(dt: Dt, terms: Dt[], yearGan: number): [number, number] {
  let i: number;
  for (i = 0; i < 12 && dt >= terms[2 * i]; i++);
  let m: number;
  if (i === 0) m = 11;
  else if (i === 1) m = 12;
  else m = i - 1;
  const zi = (m + 1) % 12 + 1;
  if (yearGan % 5 === 1) m += 1;
  else if (yearGan % 5 === 2) m += 13;
  else if (yearGan % 5 === 3) m += 25;
  else if (yearGan % 5 === 4) m += 37;
  else m += 49;
  return [m % 10 + 1, zi];
}

/** 일주 [천간, 지지] */
export function toSajuDay(dt: Dt): [number, number] {
  let y = year(dt);
  if (hour(dt) === 23 && minute(dt) >= 30) dt = addHours(dt, 1);   // 23시 30분 이후는 다음날 자시로 본다
  y -= 1900;
  const d = y * 5 + Math.trunc((y - 1) / 4) + dayOfYear(dt) - 1;
  return [d % 10 + 1, (d + 10) % 12 + 1];
}

/** 시주 [천간, 지지] */
export function toSajuTime(dt: Dt, dayGan: number): [number, number] {
  const time = minutesOfDay(dt);   // 서울 표준시 127.5 기준
  const zi = (Math.trunc(Math.trunc(time + 30) / 120)) % 12 + 1;
  let g = 0;
  if (dayGan % 5 === 1) g += 0;
  else if (dayGan % 5 === 2) g += 12;
  else if (dayGan % 5 === 3) g += 24;
  else if (dayGan % 5 === 4) g += 36;
  else g += 48;
  return [(g + zi - 1) % 10 + 1, zi];
}
