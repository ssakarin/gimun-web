// C# 엔진(tools/EngineDump 로 뽑은 정답지)과 TypeScript 이식본의 결과가 같은지 확인한다.
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import {
  calculate, calculateLunar, findBirthDates, toLunarDate, toSolarDate, get24Terms, fmtIso, parseIso, mk, setMonthDays, calcHyear,
} from "../src/engine/index";

const golden = (f: string) => resolve(process.env.GOLDEN_DIR ?? resolve(__dirname, "golden"), f);
const json = (f: string) => JSON.parse(readFileSync(golden(f), "utf-8"));
const nl = (s: string) => s.replace(/\r\n/g, "\n");

const GOONG_FIELDS = ["hongNum", "b_dong", "b_gan", "yoo_age", "six_sin", "hongNumlvl", "yooksam", "eightmun", "timeeightmun",
  "eightgoe", "goosung", "eightjang", "cheoneul", "cheonma", "ilrok", "eunsung", "gongmang", "sinsal", "kyukkuk",
  "taeulgusung", "josang"] as const;

describe("계산 결과 (C# 정답지와 비교)", () => {
  const cases = json("cases.json") as any[];

  it("정답지 파일이 충분히 있다", () => {
    expect(cases.length).toBeGreaterThanOrEqual(500);
  });

  cases.forEach((c, idx) => {
    const inp = c.in;
    it(`#${idx} ${inp.kind} ${inp.y}-${inp.m}-${inp.d} ${inp.h}:${inp.mi} g${inp.gender}`, () => {
      const run = () => inp.kind === "solar"
        ? calculate(mk(inp.y, inp.m, inp.d, inp.h, inp.mi), inp.gender)
        : calculateLunar(inp.y, inp.m, inp.d, inp.h, inp.mi, inp.leap, inp.gender);
      if (c.out === null) { expect(run).toThrow(); return; }
      const r = run();
      const o = c.out;
      expect(fmtIso(r.solarDt)).toBe(o.solarDt);
      expect(fmtIso(r.realDt)).toBe(o.realDt);
      expect(r.lunarValid).toBe(o.lunarValid);
      expect(r.ly).toBe(o.ly);
      if (o.lunarValid) expect([r.lunarYear, r.lunarMonth, r.lunarDay]).toEqual(o.lunar);
      expect(r.terms.map(fmtIso)).toEqual(o.terms);
      expect(r.direction).toBe(o.direction);
      expect(r.sjGanzi).toEqual(o.sjGanzi);
      expect([r.eunboksu1, r.eunboksu2]).toEqual(o.eunboksu);
      expect(r.sisunsoo).toBe(o.sisunsoo);
      expect(nl(r.birthJeolgi)).toBe(nl(o.birthJeolgi));
      expect(r.daeun).toEqual(o.daeun.map((d: any) => ({ startAge: d.age, gan: d.gan, zi: d.zi })));
      for (let g = 0; g < 9; g++)
        for (const f of GOONG_FIELDS)
          expect((r.goong[g] as any)[f], `goong[${g}].${f}`).toEqual(o.goong[g][f]);
    });
  });
});

describe("사주팔자 -> 생시 후보", () => {
  const cases = json("palja.json") as any[];
  cases.forEach((c, idx) => {
    it(`#${idx}`, () => {
      const r = findBirthDates(c.sjGanzi);
      expect(r.found.map(fmtIso)).toEqual(c.found);
      expect(r.lastTerms.map(fmtIso)).toEqual(c.lastTerms);
    });
  });
});

describe("음력 변환", () => {
  it("1901-01-01 ~ 2050-02-10 전 구간이 .NET 결과와 같다 (해시 비교)", () => {
    const lines: string[] = [];
    for (let t = mk(1901, 1, 1); t <= mk(2050, 2, 10); t += 86400000) {
      const l = toLunarDate(t);
      lines.push(`${fmtIso(t).slice(0, 10)} ${l.ly ? 1 : 0} ${l.year} ${l.month} ${l.day}`);
    }
    const text = lines.join("\n") + "\n";
    const hash = createHash("sha256").update(text).digest("hex");
    expect(hash).toBe(readFileSync(golden("lunardays.sha256"), "utf-8").trim());
  });

  it("음력 -> 양력 -> 음력 왕복", () => {
    for (let t = mk(1901, 3, 1); t <= mk(2049, 12, 1); t += 86400000 * 7) {
      const l = toLunarDate(t);
      const back = toSolarDate(l.year, l.month, l.day, l.ly, 0, 0);
      expect(fmtIso(back).slice(0, 10)).toBe(fmtIso(t).slice(0, 10));
    }
  });

  it("범위를 벗어나면 예외", () => {
    expect(() => toLunarDate(mk(2050, 2, 11))).toThrow();
    expect(() => toSolarDate(2020, 4, 31, false, 0, 0)).toThrow();
  });
});

describe("절기", () => {
  it("2024년 입춘은 2월 4일", () => {
    const t = get24Terms(mk(2024, 6, 1));
    expect(fmtIso(t[2]).slice(0, 10)).toBe("2024-02-04");
    expect(parseIso(fmtIso(t[2]))).toBe(t[2]);
  });
});

describe("신수운 월국 / 행년", () => {
  const cases = json("monthdays.json") as any[];
  cases.forEach((c, idx) => {
    it(`월국 #${idx}`, () => {
      const r = calculate(parseIso(c.date), 1);
      const run = () => setMonthDays(r.goong, r.sjGanzi, r.direction, c.solar, !c.solar, c.pick[2], c.pick[0], c.pick[1], c.textMonth);
      if (c.out === null) { expect(run).toThrow(); return; }
      run();
      expect(r.goong.map((g) => [g.month_days, g.month_days_1])).toEqual(c.out);
    });
  });

  it("행년: 첫 해(1세)는 남 9궁, 여 1궁", () => {
    expect(calcHyear(1, 1)).toBe(9);
    expect(calcHyear(0, 1)).toBe(1);
    expect(calcHyear(1, 2)).toBe(7);   // HyearRR[(2+6)%8] = 7
    expect(calcHyear(0, 2)).toBe(7);
  });
});
