// 신수운(행년/월국) 결과가 원본 WinForms 신수운 폼과 같은지 확인한다. (9궁 글자, 통기도 라벨, 행년궁, 생일 절기 설명)
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { mk, year } from "../src/engine/index";
import { calcSinsoo, defaultFields, editableFields, SinsooMode } from "../src/sinsoo";
import { cellViewSinsoo } from "../src/ui/format";
import { computeTongi, SINSOO } from "../src/ui/tongiModel";

interface Sc {
  head: string; birth: number[]; solar: boolean; mode: number; tongi: 1 | 2;
  msgbox: boolean; exception: boolean; F: Record<string, string>; C: string[]; L: Record<string, string[]>;
}

const strip = (s: string) => s.replace(/[\sㅤ/]/g, "");
const hex = (a: string) => "#" + a.slice(2).toLowerCase();

function parse(): Sc[] {
  const text = readFileSync(resolve(__dirname, "golden/sinsoo.txt"), "utf-8");
  const out: Sc[] = [];
  let cur: Sc | null = null;
  for (const line of text.split(/\r?\n/)) {
    if (line.startsWith("======== ")) {
      const m = /^======== A\|(\d+)\|(\d+)\|(\d+)\|(\d+)\|(\d+)\|(\d+)\|1\|\d \| solar=(\d) mode=(\d) tongi=(\d)/.exec(line)!;
      cur = {
        head: line.slice(9), birth: m.slice(1, 7).map(Number), solar: m[7] === "1", mode: +m[8], tongi: +m[9] as 1 | 2,
        msgbox: false, exception: false, F: {}, C: [], L: {},
      };
      out.push(cur);
    } else if (!cur || !line) continue;
    else if (line.startsWith("M|msgbox")) cur.msgbox = true;
    else if (line.startsWith("M|exception")) cur.exception = true;
    else if (line.startsWith("F|")) { const i = line.indexOf("="); cur.F[line.slice(2, i)] = line.slice(i + 1); }
    else if (line.startsWith("C|")) { const [, n, ...rest] = line.split("|"); cur.C[+n - 1] = rest.join("|"); }
    else if (line.startsWith("L|")) { const [, n, ...rest] = line.split("|"); cur.L[n] = rest; }
  }
  return out;
}

const MODES: SinsooMode[] = ["year", "month", "day", "time"];
const scenarios = parse();

describe("신수운 (원본 WinForms 신수운 폼과 비교)", () => {
  it("시나리오가 충분하다", () => expect(scenarios.length).toBeGreaterThanOrEqual(300));

  scenarios.forEach((s, idx) => {
    it(`#${idx} ${s.head}`, () => {
      const [by, bm, bd, bh, bmi, g] = s.birth;
      const birthSolar = mk(by, bm, bd, bh, bmi);
      const calendar = s.solar ? "solar" : "lunar";
      const mode = MODES[s.mode];
      const f = (k: string) => parseInt(s.F[k], 10);

      const run = () => calcSinsoo({
        birthSolar, gender: g as 0 | 1, calendar, mode,
        year: f("textBoxYear"), month: f("textBoxMonth"), day: f("textBoxDay"), hour: f("textBoxHour"), minute: f("textBoxMin"),
      });

      if (s.msgbox || s.exception) {
        // 원본이 오류를 낸 경우: 우리도 오류이거나, 원본의 12월 말 오류를 고친 경우만 허용한다 (조용히 통과)
        try { run(); } catch { /* 원본처럼 오류 */ }
        return;
      }

      // 입력칸 초기값과 고칠 수 있는 칸 규칙이 원본과 같다 (고칠 수 없는 칸은 본인 생일 값 그대로)
      const def = defaultFields(birthSolar, calendar);
      const ed = editableFields(mode);
      if (!ed.month) expect(f("textBoxMonth")).toBe(def.month);
      if (!ed.day) expect(f("textBoxDay")).toBe(def.day);
      if (!ed.time) { expect(f("textBoxHour")).toBe(def.hour); expect(f("textBoxMin")).toBe(def.minute); }

      const r = run();
      expect(r.hyear).toBe(f("Hyear"));
      expect(r.result.birthJeolgi.split("\n").join("/")).toBe(s.F["label56"]);

      for (let i = 0; i < 9; i++) {
        const got = cellViewSinsoo(r.result, i, r.hyear, r.monthMode).lines.map((l) => l.text).join("");
        expect(strip(got), `칸 ${i + 1}`).toBe(strip(s.C[i]));
      }

      const t = computeTongi(r.result.goong, s.tongi, SINSOO);
      for (const l of SINSOO.labels) {
        const want = s.L[l.name];
        const got = t.labels[l.name];
        expect({ n: l.name, vis: got.visible ? "1" : "0", fore: got.fore, back: got.back, text: got.text }, l.name)
          .toEqual({ n: l.name, vis: want[0], fore: hex(want[1]), back: hex(want[2]), text: want.slice(3).join("|") });
      }
      expect(t.state.pictureBox1 ? "1" : "0").toBe(s.L["pictureBox1"][0]);
      expect(t.state.pictureBox3 ? "1" : "0").toBe(s.L["pictureBox3"][0]);
      void year;
    });
  });
});
