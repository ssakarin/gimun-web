// 신수운(행년/월국): 한 사람의 사주에 대해 "그 해(월, 일, 시)의 기문"을 따로 뽑아 본다.
// 원본 신수운 폼(Form4)의 동작을 그대로 옮겼다.
import {
  Dt, SajuResult, calculate, calculateLunar, calcHyear, setMonthDays, toLunarDate, year, month, day, hour, minute, mk,
} from "./engine/index";

export type SinsooMode = "year" | "month" | "day" | "time";   // 年局 月局 日局 時局
export type SinsooCal = "solar" | "lunar";

export interface SinsooInput {
  birthSolar: Dt;            // 본인의 양력 생일시
  gender: 0 | 1;             // 1=남
  calendar: SinsooCal;       // 목표 일시를 양력/음력 중 어느 쪽으로 읽는가
  mode: SinsooMode;
  year: number; month: number; day: number; hour: number; minute: number;   // 입력칸 값
}

export interface SinsooResult {
  result: SajuResult;
  hyear: number;             // 행년궁 (1~9)
  age: number;               // 세는 나이
  monthMode: boolean;        // 월국 표시 여부
}

/** 입력칸에서 고칠 수 있는 항목 (나머지는 본인 생일 값으로 고정) */
export function editableFields(mode: SinsooMode): { month: boolean; day: boolean; time: boolean } {
  return { month: mode !== "year", day: mode === "day" || mode === "time", time: mode === "time" };
}

/** 달력(양력/음력)을 바꾸거나 국을 바꿨을 때 입력칸의 처음 값: 본인 생일 값 */
export function defaultFields(birthSolar: Dt, calendar: SinsooCal)
  : { year: number; month: number; day: number; hour: number; minute: number } {
  if (calendar === "solar")
    return { year: year(birthSolar), month: month(birthSolar), day: day(birthSolar), hour: hour(birthSolar), minute: minute(birthSolar) };
  const l = toLunarDate(birthSolar);
  return { year: l.year, month: l.month, day: l.day, hour: hour(birthSolar), minute: minute(birthSolar) };
}

export function calcSinsoo(inp: SinsooInput): SinsooResult {
  const age = inp.year - year(inp.birthSolar) + 1;
  const hyear = calcHyear(inp.gender, age);

  let result: SajuResult;
  if (inp.calendar === "solar") {
    result = calculate(mk(inp.year, inp.month, inp.day, inp.hour, inp.minute), inp.gender);
  } else {
    // 원본은 음력일 때 시/분을 본인 생일의 시/분으로 쓴다
    result = calculateLunar(inp.year, inp.month, inp.day, hour(inp.birthSolar), minute(inp.birthSolar), false, inp.gender);
  }

  const monthMode = inp.mode === "month";
  if (monthMode) {
    // 월국의 기준일(생일의 '일')과 달 길이는 입력칸이 아니라 본인 생일 쪽 값을 쓴다 (원본 그대로)
    const solar = inp.calendar === "solar";
    const lunarBirth = toLunarDate(inp.birthSolar);
    const pickDay = solar ? day(inp.birthSolar) : lunarBirth.day;
    const pickYear = solar ? year(inp.birthSolar) : lunarBirth.year;
    const pickMonth = solar ? month(inp.birthSolar) : lunarBirth.month;
    setMonthDays(result.goong, result.sjGanzi, result.direction, solar, !solar, pickDay, pickYear, pickMonth, String(inp.month));
  }
  return { result, hyear, age, monthMode };
}
