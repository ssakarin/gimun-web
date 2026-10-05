// 9궁 보기(유년소운, 홍국기문)가 원본 WinForms 프로그램과 같은 글자인지 확인한다.
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { calculate, mk } from "../src/engine/index";
import { cellView, cellViewHongguk } from "../src/ui/format";
import { yunyun } from "../src/ui/yunyun";

const strip = (s: string) => s.replace(/[\sㅤ]/g, "");
const clean = (s: string) => strip(s.split("\\r").join("").split("\\n").join(""));

interface Sc { head: string; msgbox: Record<string, boolean>; cells: Record<string, string[]> }

function parse(): Sc[] {
  const text = readFileSync(resolve(__dirname, "golden/views.txt"), "utf-8");
  const out: Sc[] = [];
  let cur: Sc | null = null;
  let sec = "";
  for (const line of text.split(/\r?\n/)) {
    if (line.startsWith("======== ")) { cur = { head: line.slice(9), msgbox: {}, cells: {} }; out.push(cur); }
    else if (!cur) continue;
    else if (line.startsWith("#### ")) {
      const m = /^#### (\S+) \(msgbox=(\w+)\)/.exec(line)!;
      sec = m[1]; cur.msgbox[sec] = m[2] === "yes"; cur.cells[sec] = [];
    } else if (line.startsWith("C|")) {
      const i = line.indexOf("|", 2);
      cur.cells[sec][+line.slice(2, i) - 1] = line.slice(i + 1);
    }
  }
  return out;
}

const scenarios = parse();

describe("9궁 보기 (원본 WinForms 와 비교)", () => {
  it("시나리오가 충분하다", () => expect(scenarios.length).toBeGreaterThanOrEqual(60));

  scenarios.forEach((s, idx) => {
    it(`#${idx} ${s.head}`, () => {
      const [, y, m, d, h, mi, g] = s.head.split("|").map(Number);
      const r = calculate(mk(y, m, d, h, mi), g);
      const btn = s.head.split("|").pop();
      const join = (lines: { text: string }[]) => lines.map((l) => l.text).join("");
      const calc = s.cells["after-calc"];
      if (s.msgbox["after-calc"] || !calc) return;   // 원본이 12월 말 생일에서 오류로 중단된 경우는 새 프로그램이 고친 부분

      for (let i = 0; i < 9; i++) expect(strip(join(cellView(r, i).lines)), `기본 칸 ${i + 1}`).toBe(clean(calc[i]));

      if (btn === "button7") {
        for (let i = 0; i < 9; i++) expect(strip(join(cellViewHongguk(r, i).lines)), `홍국기문 칸 ${i + 1}`).toBe(clean(s.cells["after-button7"][i]));
      } else if (btn === "button5") {
        const yy = yunyun(r);
        for (let i = 0; i < 9; i++) {
          expect(strip(join(cellView(r, i).lines) + yy[i]), `유년소운 칸 ${i + 1}`).toBe(clean(s.cells["after-button5"][i]));
          // 한 번 더 누르면 원래 보기로 돌아온다
          expect(strip(join(cellView(r, i).lines)), `원복 칸 ${i + 1}`).toBe(clean(s.cells["after-button5-2"][i]));
        }
      }
    });
  });
});
