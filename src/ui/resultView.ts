// 결과 화면. 원래 프로그램처럼 왼쪽(입력, 사주, 10년 대운, 통기도)과 오른쪽(12지가 둘러싼 9궁 판)으로 나뉜다.
// 좁은 화면(휴대폰)에서는 위아래로 쌓인다. 기본 화면과 신수운 화면이 같이 쓴다.
import { SajuResult, toGan, toZi, toNum, getZiYooksin, getGanYooksin, year } from "../engine/index";
import { cellView, cellViewSinsoo, cellViewHongguk, ganColor, ziColor, GRID_ORDER, CellView } from "./format";
import { yunyun } from "./yunyun";
import { renderTongi } from "./tongiView";
import { BASIC, SINSOO, Mode } from "./tongiModel";

function el(tag: string, cls?: string, text?: string): HTMLElement {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

export interface ViewInfo {
  title: string;        // 첫 줄 (이름 · 날짜)
  sub: string;          // 둘째 줄 (보정 시각 등)
  birth: string;        // 생일 절기 설명
  extra?: string;       // 추가 한 줄 (신수운: 행년 안내)
}

export interface ResultViewOptions {
  id: string;             // 라디오 이름 충돌을 막기 위한 고유 이름
  daeun: boolean;         // 10년 대운 표시 여부
  sinsoo: boolean;        // 신수운 모양 (칸 글자, 통기도 그림 상자가 다름)
  leftTop?: HTMLElement[]; // 왼쪽 위에 먼저 놓을 것 (입력 폼 등)
  rightTop?: HTMLElement[]; // 오른쪽 위에 먼저 놓을 것
}

export type GridView = "qimen" | "yunyun" | "hongguk";
export interface Sinsoo { hyear: number; monthMode: boolean }

const NUMERAL = /^[一二三四五六七八九十]$/;

/** 칸의 한 줄을 원본 AlignText 의 글꼴 규칙대로 꾸민다 */
function fillLine(row: HTMLElement, idx: number, text: string, quimen: boolean): void {
  if (quimen && idx === 0) {                   // 1줄: 年支/月支… 파랑, 年干/月干… 초록 바탕
    text.split(" ").forEach((tok, i) => {
      if (i > 0) row.append(" ");
      if (/^[年月日時]支$/.test(tok)) row.append(el("span", "tag ji", tok));
      else if (/^[年月日時]干$/.test(tok)) row.append(el("span", "tag gan", tok));
      else row.append(tok);
    });
    return;
  }
  if (quimen && (idx === 3 || idx === 4)) {    // 4, 5줄: 홍국수(한자 숫자)는 굵게, 世 는 빨강 굵게
    const toks = text.split(" ");
    let boldDone = false;
    toks.forEach((tok, i) => {
      if (i > 0) row.append(" ");
      if (!boldDone && NUMERAL.test(tok)) { boldDone = true; row.append(el("b", "", tok)); }
      else if (tok === "世") row.append(el("span", "red", tok));
      else row.append(tok);
    });
    return;
  }
  if (text.indexOf("世") >= 0 && idx >= 3) {
    const [a, b] = [text.slice(0, text.indexOf("世")), text.slice(text.indexOf("世") + 1)];
    row.append(a, el("span", "red", "世"), b);
    return;
  }
  row.textContent = text;
}

export class ResultView {
  readonly root: HTMLElement;       // 이미지 저장/인쇄할 영역
  private left = el("div", "rv-left");
  private right = el("div", "rv-right");
  private info = el("div", "panel info");
  private titleEl = el("div", "title");
  private subEl = el("div", "muted");
  private birthEl = el("div", "birth");
  private extraEl = el("div", "extra");
  private pillarsEl = el("div", "panel pillars");
  private daeunEl = el("div", "daeun");
  private tongiEl = el("div", "tongi");
  private boardEl = el("div", "board");
  private partsHost = el("div", "rv-parts");     // 계산 결과가 있을 때만 보이는 왼쪽 부분
  private last: { r: SajuResult; s?: Sinsoo } | null = null;
  private viewMode: GridView = "qimen";

  constructor(private opts: ResultViewOptions) {
    this.root = el("div", "rv empty");
    for (const e of opts.leftTop ?? []) this.left.append(e);
    this.info.append(this.titleEl, this.subEl, this.birthEl, this.extraEl);
    this.partsHost.append(this.info, this.pillarsEl);

    if (opts.daeun) {
      const p = el("div", "panel daeun-panel");
      p.append(el("h2", "", "10년 대운"), this.daeunEl);
      this.partsHost.append(p);
    }

    const tp = el("div", "panel tongi-panel");
    const head = el("div", "row between");
    head.append(el("h2", "", "통기도"));
    const fs = el("fieldset", "seg no-export");
    fs.append(el("legend", "sr-only", "그림"));
    for (const [v, label] of [["1", "단1"], ["2", "단2"]]) {
      const lb = document.createElement("label");
      const rd = document.createElement("input");
      rd.type = "radio"; rd.name = "tongi-" + opts.id; rd.value = v; rd.checked = v === "1";
      rd.addEventListener("change", () => this.drawTongi());
      lb.append(rd, " " + label);
      fs.append(lb);
    }
    head.append(fs);
    tp.append(head, this.tongiEl);
    this.partsHost.append(tp);
    this.left.append(this.partsHost);

    for (const e of opts.rightTop ?? []) this.right.append(e);
    this.buildBoard();
    this.drawEmptyBoard();
    this.right.append(this.boardEl);
    this.root.append(this.left, this.right);
  }

  /** 12지가 둘러싼 판의 틀 (칸은 renderGrid 가 채운다) */
  private buildBoard(): void {
    const put = (txt: string, area: string) => { const e = el("div", "bl", txt); e.style.gridArea = area; this.boardEl.append(e); };
    ["巳", "午", "未"].forEach((t, i) => put(t, `1 / ${i + 2}`));
    ["辰", "卯", "寅"].forEach((t, i) => put(t, `${i + 2} / 1`));
    ["申", "酉", "戌"].forEach((t, i) => put(t, `${i + 2} / 5`));
    ["丑", "子", "亥"].forEach((t, i) => put(t, `5 / ${i + 2}`));
  }

  /** 계산 전에도 빈 판을 보여준다 (원본 프로그램처럼) */
  private drawEmptyBoard(): void {
    GRID_ORDER.forEach((i, pos) => {
      const cell = el("div", "cell blank" + (i === 4 ? " center" : ""));
      cell.style.gridArea = `${Math.floor(pos / 3) + 2} / ${(pos % 3) + 2}`;
      this.boardEl.append(cell);
    });
  }

  private tongiMode(): Mode {
    const c = this.root.querySelector(`input[name="tongi-${this.opts.id}"]:checked`) as HTMLInputElement;
    return (parseInt(c.value, 10) as Mode);
  }

  private drawTongi(): void {
    if (this.last) renderTongi(this.tongiEl, this.last.r.goong, this.tongiMode(), this.opts.sinsoo ? SINSOO : BASIC);
  }

  update(r: SajuResult, info: ViewInfo, s?: Sinsoo): void {
    this.last = { r, s };
    this.root.classList.remove("empty");
    this.titleEl.textContent = info.title;
    this.subEl.textContent = info.sub;
    this.subEl.hidden = !info.sub;
    // 절기 줄과 상원/국 줄 사이의 빈 줄을 없애 세 줄이 붙어서 나오게 한다
    this.birthEl.textContent = info.birth.split(/\r?\n/).filter((l) => l.trim() !== "").join("\n");
    this.extraEl.textContent = info.extra ?? "";
    this.extraEl.hidden = !info.extra;
    this.renderPillars(r);
    if (this.opts.daeun) this.renderDaeun(r);
    this.renderGrid(r, s);
    this.drawTongi();
  }

  /** 9궁 보기 방식(기문둔갑 / 유년소운 / 홍국기문)을 바꾼다 */
  setViewMode(m: GridView): void {
    this.viewMode = m;
    if (this.last) this.renderGrid(this.last.r, this.last.s);
  }

  /** 계산 결과가 없을 때(입력 오류 등) 결과 부분을 숨긴다 */
  clear(): void {
    this.last = null;
    this.root.classList.add("empty");
    this.boardEl.querySelectorAll(".cell").forEach((c) => c.remove());
    this.drawEmptyBoard();
  }

  private renderPillars(r: SajuResult): void {
    const box = this.pillarsEl;
    box.replaceChildren();
    const names = ["年", "月", "日", "時"];
    const sj = r.sjGanzi;
    const g4 = r.goong[4];
    // 원본처럼: 맨 왼쪽에 중궁의 천/지 홍국수, 시일월년 순서, 간 위에는 천간 육신, 지 아래에는 지지 육신
    const hong = el("div", "hongbox");
    hong.append(el("div", "hb-title", "洪局數"), el("div", "hb", toNum(g4.hongNum[0])), el("div", "hb", toNum(g4.hongNum[1])));
    box.append(hong);
    for (let k = 3; k >= 0; k--) {
      const col = el("div", "pillar");
      col.append(el("div", "pname", names[k]));
      const gy = el("div", "pyk" + (k === 2 ? " day" : ""), k === 2 ? "일원" : getGanYooksin(sj[2][0], sj[k][0]));
      col.append(gy);
      const gan = el("div", "pc", toGan(sj[k][0]));
      gan.style.background = ganColor(sj[k][0]);
      const zi = el("div", "pc", toZi(sj[k][1]));
      zi.style.background = ziColor(sj[k][1]);
      col.append(gan, zi, el("div", "pyk", getZiYooksin(sj[2][0], sj[k][1])));
      box.append(col);
    }
  }

  private renderDaeun(r: SajuResult): void {
    this.daeunEl.replaceChildren();
    const nowAge = new Date().getFullYear() - year(r.realDt);
    // 원본처럼 나이가 많은 쪽이 왼쪽
    for (const d of [...r.daeun].reverse()) {
      const c = el("div", "dae");
      if (d.startAge <= nowAge && nowAge < d.startAge + 10) c.classList.add("now");
      c.append(el("div", "age", String(d.startAge)), el("div", "gz", d.gan), el("div", "gz", d.zi));
      this.daeunEl.append(c);
    }
  }

  private renderGrid(r: SajuResult, s?: Sinsoo): void {
    // 판의 틀(12지 글자)은 남기고 칸만 다시 그린다
    this.boardEl.querySelectorAll(".cell").forEach((c) => c.remove());
    const yy = this.viewMode === "yunyun" ? yunyun(r) : [];
    GRID_ORDER.forEach((i, pos) => {
      let v: CellView;
      if (this.opts.sinsoo && s) v = cellViewSinsoo(r, i, s.hyear, s.monthMode);
      else if (this.viewMode === "hongguk") v = cellViewHongguk(r, i);
      else {
        v = cellView(r, i);
        if (this.viewMode === "yunyun") v = { ...v, lines: [...v.lines, { text: yy[i], size: "s" as const }] };
      }
      const cell = el("div", "cell");
      cell.style.gridArea = `${Math.floor(pos / 3) + 2} / ${(pos % 3) + 2}`;
      if (v.isCenter) cell.classList.add("center");
      else if (v.hasJi) cell.classList.add("ji");
      if (this.opts.sinsoo && s && i === s.hyear - 1) cell.classList.add("hyear");
      const qimenLike = this.viewMode === "qimen" || !!(this.opts.sinsoo && s);
      v.lines.forEach((ln, idx) => {
        const row = el("div", "ln l" + (qimenLike ? idx : "x"));
        if (ln.redFirst && ln.text.startsWith("世")) {
          row.append(el("span", "red", "世"), ln.text.slice(1));
        } else fillLine(row, idx, ln.text, qimenLike);
        if (ln.align === "right") row.classList.add("right");
        if (ln.align === "center") row.classList.add("center");
        if (ln.size) row.classList.add("sz-" + ln.size);
        cell.append(row);
      });
      this.boardEl.append(cell);
    });
  }
}
