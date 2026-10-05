// 통기도 라벨(글자/보임/색)이 원본 WinForms 프로그램과 같은지 확인한다.
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { calculate, mk } from "../src/engine/index";
import { computeTongi } from "../src/ui/tongiModel";
import { LABELS } from "../src/ui/tongiLabels.gen";

interface Rec { vis: boolean; fore: string; back: string; text: string }
interface Scenario { head: string; mode: 1 | 2; labels: Record<string, Rec>; pictures: Record<string, boolean>; msgbox: boolean }

function parse(): Scenario[] {
  const text = readFileSync(resolve(__dirname, "golden/tongi.txt"), "utf-8");
  const out: Scenario[] = [];
  let cur: Scenario | null = null;
  const hex = (a: string) => "#" + a.slice(2).toLowerCase();
  for (const line of text.split(/\r?\n/)) {
    if (line.startsWith("======== ")) {
      const m = /^======== (.*) mode=(\d)$/.exec(line)!;
      cur = { head: m[1], mode: +m[2] as 1 | 2, labels: {}, pictures: {}, msgbox: false };
      out.push(cur);
    } else if (!cur || !line) continue;
    else if (line === "MSGBOX") cur.msgbox = true;
    else if (line.startsWith("pictureBox")) { const [n, v] = line.split("|"); cur.pictures[n] = v === "1"; }
    else {
      const [n, vis, fore, back, ...rest] = line.split("|");
      cur.labels[n] = { vis: vis === "1", fore: hex(fore), back: hex(back), text: rest.join("|") };
    }
  }
  return out;
}

const scenarios = parse();

describe("통기도 (원본 WinForms 와 비교)", () => {
  it("시나리오가 충분하다", () => expect(scenarios.length).toBeGreaterThanOrEqual(200));

  scenarios.forEach((s, idx) => {
    it(`#${idx} ${s.head} 단${s.mode}`, () => {
      const [, y, m, d, h, mi, g] = s.head.split("|").map(Number);
      // 원본이 12월 말 생일에서 오류로 중단되던 경우(MSGBOX)는 새 프로그램이 고친 부분이라 비교하지 않는다
      if (s.msgbox) return;
      const r = calculate(mk(y, m, d, h, mi), g);
      const t = computeTongi(r.goong, s.mode);
      for (const l of LABELS) {
        const want = s.labels[l.name];
        const got = t.labels[l.name];
        expect({ n: l.name, vis: got.visible, fore: got.fore, back: got.back, text: got.text }, l.name)
          .toEqual({ n: l.name, vis: want.vis, fore: want.fore, back: want.back, text: want.text });
      }
      expect(t.state.pictureBox1).toBe(s.pictures["pictureBox1"]);
      expect(t.state.pictureBox3).toBe(s.pictures["pictureBox3"]);
    });
  });
});
