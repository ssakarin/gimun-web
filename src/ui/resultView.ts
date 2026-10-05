// 결과 화면(날짜 표시, 사주 4주, 10년 대운, 통기도, 9궁)을 만드는 부분. 기본 화면과 신수운 화면이 같이 쓴다.
import { SajuResult, toGan, toZi, getZiYooksin, getGanYooksin, year } from "../engine/index";
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
  id: string;           // 라디오 이름 충돌을 막기 위한 고유 이름
  daeun: boolean;       // 10년 대운 표시 여부
  sinsoo: boolean;      // 신수운 모양 (칸 글자, 통기도 그림 상자가 다름)
  views?: boolean;      // 9궁 보기 선택(기문둔갑/유년소운/홍국기문) 표시 여부
}

export type GridView = "qimen" | "yunyun" | "hongguk";

export interface Sinsoo { hyear: number; monthMode: boolean }

export class ResultView {
  readonly root: HTMLElement;       // 이미지 저장/인쇄할 영역
  private info = el("div", "panel info");
  private titleEl = el("div");
  private subEl = el("div", "muted");
  private birthEl = el("div", "birth");
  private extraEl = el("div", "extra");
  private pillarsEl = el("div", "panel pillars");
  private daeunEl = el("div", "daeun");
  private tongiEl = el("div", "tongi");
  private gridEl = el("div", "grid9");
  private last: { r: SajuResult; s?: Sinsoo } | null = null;
  private viewMode: GridView = "qimen";

  constructor(private opts: ResultViewOptions) {
    this.root = el("div", "resultview");
    this.info.append(this.titleEl, this.subEl, this.birthEl, this.extraEl);
    this.root.append(this.info, this.pillarsEl);

    if (opts.daeun) {
      const p = el("div", "panel");
      p.append(el("h2", "", "10년 대운"), this.daeunEl);
      this.root.append(p);
    }

    const tp = el("div", "panel");
    const head = el("div", "row between");
    head.append(el("h2", "", "통기도"));
    const fs = el("fieldset", "seg no-export");
    fs.append(el("legend", "", "그림"));
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
    this.root.append(tp);
    if (opts.views) {
      const vp = el("div", "row views no-export");
      const vf = el("fieldset", "seg");
      vf.append(el("legend", "", "9궁 보기"));
      for (const [v, label] of [["qimen", "기문둔갑"], ["yunyun", "유년소운"], ["hongguk", "홍국기문"]]) {
        const lb = document.createElement("label");
        const rd = document.createElement("input");
        rd.type = "radio"; rd.name = "view-" + opts.id; rd.value = v; rd.checked = v === "qimen";
        rd.addEventListener("change", () => { this.viewMode = v as GridView; if (this.last) this.renderGrid(this.last.r, this.last.s); });
        lb.append(rd, " " + label);
        vf.append(lb);
      }
      vp.append(vf);
      this.root.append(vp);
    }
    this.root.append(this.gridEl);
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
    this.titleEl.textContent = info.title;
    this.subEl.textContent = info.sub;
    this.birthEl.textContent = info.birth;
    this.extraEl.textContent = info.extra ?? "";
    this.extraEl.hidden = !info.extra;
    this.renderPillars(r);
    if (this.opts.daeun) this.renderDaeun(r);
    this.renderGrid(r, s);
    this.drawTongi();
  }

  private renderPillars(r: SajuResult): void {
    this.pillarsEl.replaceChildren();
    const names = ["年", "月", "日", "時"];
    const sj = r.sjGanzi;
    for (let k = 3; k >= 0; k--) {   // 보통 사주는 시일월년 순서(오른쪽이 년)
      const col = el("div", "pillar");
      col.append(el("div", "pname", names[k]));
      const gan = el("div", "pc", toGan(sj[k][0]));
      gan.style.background = ganColor(sj[k][0]);
      const zi = el("div", "pc", toZi(sj[k][1]));
      zi.style.background = ziColor(sj[k][1]);
      col.append(gan, zi);
      col.append(el("div", "pyk", k !== 2 ? getGanYooksin(sj[2][0], sj[k][0]) : "일간"));
      col.append(el("div", "pyk", getZiYooksin(sj[2][0], sj[k][1])));
      this.pillarsEl.append(col);
    }
  }

  private renderDaeun(r: SajuResult): void {
    this.daeunEl.replaceChildren();
    const nowAge = new Date().getFullYear() - year(r.realDt);
    for (const d of r.daeun) {
      const c = el("div", "dae");
      if (d.startAge <= nowAge && nowAge < d.startAge + 10) c.classList.add("now");
      c.append(el("div", "age", String(d.startAge)), el("div", "gz", d.gan), el("div", "gz", d.zi));
      this.daeunEl.append(c);
    }
  }

  private renderGrid(r: SajuResult, s?: Sinsoo): void {
    this.gridEl.replaceChildren();
    const yy = this.viewMode === "yunyun" ? yunyun(r) : [];
    for (const i of GRID_ORDER) {
      let v: CellView;
      if (this.opts.sinsoo && s) v = cellViewSinsoo(r, i, s.hyear, s.monthMode);
      else if (this.viewMode === "hongguk") v = cellViewHongguk(r, i);
      else {
        v = cellView(r, i);
        if (this.viewMode === "yunyun") v = { ...v, lines: [...v.lines, { text: yy[i], size: "s" as const }] };
      }
      const cell = el("div", "cell");
      if (v.isCenter) cell.classList.add("center");
      else if (v.hasJi) cell.classList.add("ji");
      if (this.opts.sinsoo && s && i === s.hyear - 1) cell.classList.add("hyear");
      for (const ln of v.lines) {
        const row = el("div", "ln");
        if (ln.redFirst && ln.text.startsWith("世")) {
          const red = el("span", "red", "世");
          row.append(red, ln.text.slice(1));
        } else row.textContent = ln.text;
        if (ln.align === "right") row.classList.add("right");
        if (ln.align === "center") row.classList.add("center");
        if (ln.size) row.classList.add("sz-" + ln.size);
        cell.append(row);
      }
      this.gridEl.append(cell);
    }
  }
}
