// 기문둔갑 계산 엔진의 진입점 (C# SajuEngine.cs 와 대응).
// 계산 규칙 자체는 rules.ts(자동 변환)와 calendarRules.ts 에 있다.
import {
  Dt, mk, year, month, day, hour, minute, dayOfYear, addDays, addYears, dateOnly, fmtKo,
} from "./datetime";
import { toLunarDate, toSolarDate, monthsInYear, leapMonthOf, daysInMonth } from "./lunar";
import {
  dateAdjust, get24Terms, getDirection, getohaeng_dt, toSajuYear, toSajuMonth, toSajuDay, toSajuTime,
} from "./calendarRules";
import * as R from "./rules";
import { Goong, newGoong, SajuResult, DaeunItem } from "./types";

export * from "./rules";
export * from "./calendarRules";
export * from "./types";
export { toLunarDate, toSolarDate };

/** 생일의 절기/상중하원/국 설명 (신수운 폼의 버전: 다음 해 절기까지 처리) */
export function toBirthJeolgi(i: number, j: number, k: number, realDt: Dt, terms: Dt[]): string {
  let str = "";
  const hterms = ["小寒", "大寒", "立春", "雨水", "驚蟄", "春分", "淸明", "穀雨", "立夏", "小滿", "芒種", "夏至", "小署", "大暑", "立秋", "處暑", "白露", "秋分", "寒露", "霜降", "立冬", "小雪", "大雪", "冬至"];
  const NL = "\n";
  if (i === -1) {
    const terms1 = get24Terms(addYears(realDt, -1));
    str += hterms[23] + " " + fmtKo(terms1[23]) + NL + NL;
    i = 23;
  } else if (i >= 24) {
    const terms1 = get24Terms(addYears(realDt, 1));
    i -= 24;
    str += hterms[i] + " " + fmtKo(terms1[i]) + NL + NL;
  } else {
    str += hterms[i] + " " + fmtKo(terms[i]) + NL + NL;
  }
  str += hterms[i];
  if (Math.trunc(j / 20) === 0) str += " 上元";
  else if (Math.trunc(j / 20) === 1) str += " 中元";
  else str += " 下元";
  str += " " + k + "局";
  if (i === 23 || i <= 10) str += " 陽遁";
  else str += " 陰遁";
  return str;
}

/** 육의삼기 설정. 시순수와 생일 절기 설명을 돌려준다. */
export function setYookSam(goong: Goong[], sjGanzi: number[][], dt: Dt, terms: Dt[], direction: boolean)
  : { sisunsoo: number; birthJeolgi: string } {
  const monthTbl = [
    ["甲子", "乙丑", "丙寅", "丁卯", "戊辰", "甲午", "乙未", "丙申", "丁酉", "戊戌", "己卯", "庚辰", "辛巳", "壬午", "癸未", "己酉", "庚戌", "辛亥", "壬子", "癸丑"],
    ["甲寅", "乙卯", "丙辰", "丁巳", "戊午", "甲申", "乙酉", "丙戌", "丁亥", "戊子", "己巳", "庚午", "辛未", "壬申", "癸酉", "己亥", "庚子", "辛丑", "壬寅", "癸卯"],
    ["甲辰", "乙巳", "丙午", "丁未", "戊申", "甲戌", "乙亥", "丙子", "丁丑", "戊寅", "己丑", "庚寅", "辛卯", "壬辰", "癸巳", "己未", "庚申", "辛酉", "壬戌", "癸亥"],
  ];
  const dayTbl = [
    ["甲子", "乙丑", "丙寅", "丁卯", "戊辰", "己巳", "庚午", "辛未", "壬申", "癸酉"],
    ["甲戌", "乙亥", "丙子", "丁丑", "戊寅", "己卯", "庚辰", "辛巳", "壬午", "癸未"],
    ["甲申", "乙酉", "丙戌", "丁亥", "戊子", "己丑", "庚寅", "辛卯", "壬辰", "癸巳"],
    ["甲午", "乙未", "丙申", "丁酉", "戊戌", "己亥", "庚子", "辛丑", "壬寅", "癸卯"],
    ["甲辰", "乙巳", "丙午", "丁未", "戊申", "己酉", "庚戌", "辛亥", "壬子", "癸丑"],
    ["甲寅", "乙卯", "丙辰", "丁巳", "戊午", "己未", "庚申", "辛酉", "壬戌", "癸亥"],
  ];
  const gabjaOrder = dayTbl.flat();
  const jeolgi = [[2, 8, 5], [3, 9, 6], [8, 5, 2], [9, 6, 3], [1, 7, 4], [3, 9, 6], [4, 1, 7], [5, 2, 8], [4, 1, 7], [5, 2, 8], [6, 3, 9], [9, 3, 6],
    [8, 2, 5], [7, 1, 4], [2, 5, 8], [1, 4, 7], [9, 3, 6], [7, 1, 4], [6, 9, 3], [5, 8, 2], [6, 9, 3], [5, 8, 2], [4, 7, 1], [1, 7, 4]];
  const rr = [4, 9, 2, 7, 6, 1, 8, 3];

  let i: number, j: number, k: number, start: number;

  for (i = 0; i < 9; i++) { goong[i].yooksam[0] = 10; goong[i].yooksam[1] = 10; }

  // 육의삼기 지반
  let temp = R.toGan(sjGanzi[2][0]) + R.toZi(sjGanzi[2][1]);   // 日 의 간지
  for (i = 0; i < 60 && monthTbl[Math.trunc(i / 20)][i % 20] !== temp; i++);   // 日 간지의 순번
  for (j = 0; j < 24 && dt >= terms[j]; j++);                                   // 생일이 몇 번째 절기 뒤인가

  // 생일 전 절기 日의 간지
  let j1: number, j2: number;
  let temp2: string;
  if (j !== 0) {
    [j1, j2] = toSajuDay(terms[j - 1]);
    temp2 = R.toGan(j1) + R.toZi(j2);
  } else {   // 생일이 그해 첫 절기(소한)보다 앞 -> 전해 동지
    const prev = get24Terms(addYears(dt, -1));
    [j1, j2] = toSajuDay(prev[23]);
    temp2 = R.toGan(j1) + R.toZi(j2);
  }

  // 생일 후 절기 日의 간지
  let nextJeolgi: Dt;
  let temp3: string;
  if (j === 24) {
    const next = get24Terms(addYears(dt, 1));
    [j1, j2] = toSajuDay(next[0]);
    nextJeolgi = next[0];
    temp3 = R.toGan(j1) + R.toZi(j2);
  } else {
    [j1, j2] = toSajuDay(terms[j]);
    nextJeolgi = terms[j];
    temp3 = R.toGan(j1) + R.toZi(j2);
  }

  // 60갑자 순번
  let l: number, m: number, n: number;
  for (l = 0; l < 60 && gabjaOrder[l] !== temp; l++);
  for (m = 0; m < 60 && gabjaOrder[m] !== temp2; m++);
  for (n = 0; n < 60 && gabjaOrder[n] !== temp3; n++);

  const diffHour = hour(nextJeolgi) - hour(dt);
  const diffMin = minute(nextJeolgi) - minute(dt);

  const q = n - Math.trunc(l / 15) * 15;
  if (q < 10 && q > 0) {   // 생일 절기입일이 다음 절기와 10일 이내이면 초신으로 보아 다음 절기로 간주
    if (l % 15 === 0) {    // 절기 입일이면 시각을 따져 절기보다 빠르면 이전, 뒤면 다음 절기
      if (diffHour < 0 || (diffHour === 0 && diffMin <= 0)) j++;
    } else j++;
  }

  start = jeolgi[(j + 23) % 24][Math.trunc(i / 20)];   // 지반 戊 시작하는 궁 위치

  let birthJeolgi = toBirthJeolgi(j - 1, i, start, dt, terms);
  birthJeolgi = birthJeolgi + " " + R.toOhaeng_1(getohaeng_dt(dt)) + "月令";

  for (k = 0; k < 9; k++) {
    if (direction) goong[(start + 8 + k) % 9].yooksam[1] = k;
    else goong[(start + 8 - k) % 9].yooksam[1] = k;
  }

  // 육의삼기 천반
  temp = R.toGan(sjGanzi[3][0]) + R.toZi(sjGanzi[3][1]);
  for (i = 0; i < 60 && dayTbl[Math.trunc(i / 10)][i % 10] !== temp; i++);
  for (j = 0; j < 9 && R.toYookSam(goong[j].yooksam[1]) !== R.toGan(sjGanzi[3][0]); j++);

  start = Math.trunc(i / 10);   // 시순수 값

  for (i = 0; i < 8 && rr[i] !== j + 1; i++);
  if (j === 9) {   // 시간이 甲 이면 복음국으로 취급
    i = j = 0;
    for (k = 0; k < 8; k++) goong[rr[(i + k) % 8] - 1].yooksam[0] = goong[rr[(k + j) % 8] - 1].yooksam[1];
    return { sisunsoo: start, birthJeolgi };
  }
  if (i === 8) i = 2;   // 천반 순수가 중궁이면 곤궁(2번방)으로

  for (j = 0; j < 8 && goong[rr[j] - 1].yooksam[1] !== start; j++);
  if (j === 8) {   // 시순수가 중궁에 있으면 곤궁으로 간주
    j = 2;
    for (k = 0; k < 8; k++) goong[rr[(i + k) % 8] - 1].yooksam[0] = goong[rr[(k + j) % 8] - 1].yooksam[1];
    goong[rr[i % 8] - 1].yooksam[0] = start;
    return { sisunsoo: start, birthJeolgi };
  }

  for (k = 0; k < 8; k++) goong[rr[(i + k) % 8] - 1].yooksam[0] = goong[rr[(k + j) % 8] - 1].yooksam[1];
  return { sisunsoo: start, birthJeolgi };
}

/** 사주팔자(간지)로 생시 후보 1개를 찾는다 (C# getdatefromsaju) */
export function getdatefromsaju(sjGanzi: number[][], startYear: number)
  : { found: boolean; birthdate: Dt; terms: Dt[] } {
  const pTime = (sjGanzi[3][1] - 1) * 2;   // 시주 -> 생시

  let j = 0;
  for (let i = 0; i < 60; i++) {
    if (i % 10 + 1 === sjGanzi[0][0] && i % 12 + 1 === sjGanzi[0][1]) j = i;
  }
  const pYear = startYear + j;   // 년주 -> 생년

  let tempDate = mk(pYear, 6, 1, 12, 0, 0);
  const terms = get24Terms(tempDate);
  const terms2 = get24Terms(addYears(tempDate, 1));
  tempDate = mk(year(terms[2]), month(terms[2]), day(terms[2]), pTime, 0, 0);   // 입춘 날짜, 시간만 변경

  let i: number;
  for (i = 0, j = -1; i < 365 && j === -1; i++) {
    let d = (pYear - 1900) * 5 + Math.trunc((pYear - 1901) / 4) + dayOfYear(tempDate) - 1;
    d += i;
    const sjGanDay = d % 10 + 1;
    const sjZiDay = (d + 10) % 12 + 1;

    if (sjGanDay === sjGanzi[2][0] && sjZiDay === sjGanzi[2][1]) {
      const cand = addDays(tempDate, i);
      const [mg, mz] = year(cand) === year(tempDate)
        ? toSajuMonth(cand, terms, sjGanzi[0][0])
        : toSajuMonth(cand, terms2, sjGanzi[0][0]);
      if (mg === sjGanzi[1][0] && mz === sjGanzi[1][1]) {
        const [tg, tz] = toSajuTime(cand, sjGanzi[2][0]);
        if (tg === sjGanzi[3][0] && tz === sjGanzi[3][1]) j = i;
        if (j === 0 && terms[2] > tempDate) j = -1;
      }
    }
  }
  return { found: j !== -1, birthdate: addDays(tempDate, j), terms };
}

// ---------------------------------------------------------------- 진입 함수

/** 10년 대운 9칸 */
export function calcDaeun(terms: Dt[], sjGanzi: number[][], gender: number, dt: Dt): DaeunItem[] {
  let i: number, k: number, diff: number;
  const items: DaeunItem[] = [];
  for (i = 0; i < 12 && dt >= terms[i * 2]; i++);

  const dayOnly = (t: Dt) => dateOnly(t);
  const days = (a: Dt, b: Dt) => Math.trunc((dayOnly(a) - dayOnly(b)) / 86400000);   // a - b (일)
  // C# Math.Round(double) 은 .5 에서 짝수로 반올림
  const rnd = (x: number) => { const f = Math.floor(x); const d = x - f; return d < 0.5 ? f : d > 0.5 ? f + 1 : (f % 2 === 0 ? f : f + 1); };

  if ((sjGanzi[0][0] % 2 === 1 && gender === 1) || (sjGanzi[0][0] % 2 === 0 && gender === 0)) {
    if (i === 12) {
      const terms1 = get24Terms(addYears(dt, 1));
      diff = days(terms1[0], dt);
    } else {
      diff = days(terms[i * 2], dt);
    }
    diff /= 3;
    k = rnd(diff);
    for (let j = 0; j < 9; j++)
      items.push({ startAge: k + j * 10, gan: R.toGan((sjGanzi[1][0] + j) % 10 + 1), zi: R.toZi((sjGanzi[1][1] + j) % 12 + 1) });
  } else {
    if (i === 0) {
      const terms1 = get24Terms(addYears(dt, -1));
      diff = days(dt, terms1[22]);
    } else {
      diff = days(dt, terms[2 * (i - 1)]);
    }
    diff /= 3;
    k = rnd(diff);
    for (let j = 0; j < 9; j++)
      items.push({ startAge: k + j * 10, gan: R.toGan((sjGanzi[1][0] + 8 - j) % 10 + 1), zi: R.toZi((sjGanzi[1][1] + 10 - j) % 12 + 1) });
  }
  return items;
}

function blankResult(): SajuResult {
  return {
    solarDt: 0, realDt: 0, lunarValid: false, ly: false, lunarYear: 0, lunarMonth: 0, lunarDay: 0,
    terms: [], direction: false, sjGanzi: [[0, 0], [0, 0], [0, 0], [0, 0]],
    goong: Array.from({ length: 9 }, newGoong), eunboksu1: 0, eunboksu2: 0, sisunsoo: 0, birthJeolgi: "", daeun: [],
  };
}

/** 양력 일시로 기문둔갑 전체를 계산한다. gender: 1=남, 0=여 */
export function calculate(solarDt: Dt, gender: number): SajuResult {
  const r = blankResult();
  r.solarDt = solarDt;
  const lunar = toLunarDate(solarDt);
  r.lunarValid = true;
  r.ly = lunar.ly; r.lunarYear = lunar.year; r.lunarMonth = lunar.month; r.lunarDay = lunar.day;
  compute(r, gender);
  return r;
}

/** 음력(윤달 여부 포함) 일시로 기문둔갑 전체를 계산한다 */
export function calculateLunar(y: number, m: number, d: number, h: number, mi: number, leap: boolean, gender: number): SajuResult {
  const r = blankResult();
  r.ly = leap;
  r.solarDt = toSolarDate(y, m, d, leap, h, mi);
  compute(r, gender);
  return r;
}

/** 사주팔자(간지)로 생시 후보를 찾는다(1924년 기준, 1984년 기준 각각 최대 1개). lastTerms 는 마지막으로 본 해의 24절기 */
export function findBirthDates(sjGanzi: number[][]): { found: Dt[]; lastTerms: Dt[] } {
  const found: Dt[] = [];
  let lastTerms: Dt[] = [];
  for (const startYear of [1924, 1984]) {
    const r = getdatefromsaju(sjGanzi, startYear);
    lastTerms = r.terms;
    if (r.found) found.push(r.birthdate);
  }
  return { found, lastTerms };
}

function compute(r: SajuResult, gender: number): void {
  const realDt = dateAdjust(r.solarDt);
  r.realDt = realDt;
  const terms = get24Terms(realDt);
  r.terms = terms;
  r.direction = getDirection(realDt, terms);

  const sj = r.sjGanzi;
  [sj[0][0], sj[0][1]] = toSajuYear(realDt, terms[2]);
  [sj[1][0], sj[1][1]] = toSajuMonth(realDt, terms, sj[0][0]);
  [sj[2][0], sj[2][1]] = toSajuDay(realDt);
  [sj[3][0], sj[3][1]] = toSajuTime(realDt, sj[2][0]);

  computeGoong(r, gender);
}

/** 간지, 절기, 방향이 정해진 뒤 9궁을 채운다 (사주팔자 직접 입력 때도 쓴다) */
export function computeGoong(r: SajuResult, gender: number): void {
  const goong = r.goong, sj = r.sjGanzi, realDt = r.realDt, terms = r.terms, direction = r.direction;

  const e = R.setHongNum(goong, sj);   // 홍국수
  r.eunboksu1 = e.eunboksu1; r.eunboksu2 = e.eunboksu2;
  R.setDongcheo(goong, sj);            // 동처
  R.setYooAge(goong, e.eunboksu1, e.eunboksu2);   // 유년
  R.setSixSin(goong, sj);              // 육신
  R.setHonglvl(goong, sj[1][1], realDt);   // 홍국수 강약
  const y = setYookSam(goong, sj, realDt, terms, direction);   // 육의삼기
  r.sisunsoo = y.sisunsoo; r.birthJeolgi = y.birthJeolgi;
  R.setfourGan(goong, sj);             // 사간
  R.setJoSang(goong, sj);              // 조객 상문
  R.set8mun(goong, sj, direction);     // 팔문
  R.settime8mun(goong, sj, direction); // 시가팔문
  R.set8goe(goong);                    // 팔괘
  R.setGooSung(goong, sj, y.sisunsoo); // 구성
  R.setEightjang(goong, sj, direction, y.sisunsoo);   // 팔장
  R.setCheonMaRok(goong, sj, direction);   // 천을, 천마, 일록
  R.setEunsung(goong, sj);             // 12운성
  R.setGongMang(goong, sj);            // 공망
  R.setSinsal(goong, sj);              // 신살
  R.setKyukkuk(goong, sj);             // 격국
  R.setIsabangui(goong, sj);           // 이사방위
  R.setTaeulGusung(goong, sj, direction);   // 태을구성법
  r.daeun = calcDaeun(terms, sj, gender, realDt);   // 10년 대운
}

/** 월국 - 한 달의 날짜(1일~말일)를 9궁에 나누어 붙인다 (신수운) */
export function setMonthDays(goong: Goong[], sjGanzi: number[][], direction: boolean, solarInput: boolean, lunarInput: boolean,
  birthday: number, pickerYear: number, pickerMonth: number, textMonth: string): void {
  void direction;   // 양둔/음둔 모두 같은 식이라 쓰지 않는다
  if (solarInput) {
    const m = parseInt(textMonth, 10);
    if (Number.isNaN(m)) throw new Error("월을 숫자로 입력하세요");
    let endofmonth = 30;
    if (m === 1 || m === 3 || m === 5 || m === 7 || m === 8 || m === 10 || m === 12) endofmonth = 31;
    else if (m === 2) endofmonth = 29;
    spreadMonthDays(goong, sjGanzi, birthday, endofmonth);
  }
  if (lunarInput) {
    const y = pickerYear;
    let m = pickerMonth;
    if (monthsInYear(y) > 12) {
      const leapMonth = leapMonthOf(y);
      if (m > leapMonth - 1) m++;
    }
    spreadMonthDays(goong, sjGanzi, birthday, daysInMonth(y, m));
  }
}

function spreadMonthDays(goong: Goong[], sjGanzi: number[][], birthday: number, endofmonth: number): void {
  const rr = [4, 4, 9, 2, 2, 7, 6, 6, 1, 8, 8, 3];
  const rrDay = [5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4];
  let i = 0;
  while (sjGanzi[2][1] !== rrDay[i]) i++;
  const start = i;
  for (i = 1; i <= endofmonth; i++) {
    const k = (120 + (i - birthday) + start) % 12;
    if (k === 1 || k === 4 || k === 6 || k === 9) goong[rr[k] - 1].month_days_1 += " " + i;
    else goong[rr[k] - 1].month_days += " " + i;
  }
}

/** 행년(신수운) 구궁 번호. age 는 세는 나이 */
export function calcHyear(gender: number, age: number): number {
  if (gender === 1) {
    const t = [7, 6, 1, 8, 3, 4, 9, 2];
    return age === 1 ? 9 : t[(age + 6) % 8];
  }
  const t = [7, 2, 9, 4, 3, 8, 1, 6];
  return age === 1 ? 1 : t[(age + 6) % 8];
}
