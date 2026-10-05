import "./style.css";
import { calculate, calculateLunar, mk, toGan, toZi, getZiYooksin, getGanYooksin, SajuResult } from "./engine/index";
import { cellView, dateLabel, realTimeLabel, ganColor, ziColor, GRID_ORDER } from "./ui/format";

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const input = (id: string) => $<HTMLInputElement>(id);

function fillNow(): void {
  const n = new Date();
  input("y").value = String(n.getFullYear());
  input("m").value = String(n.getMonth() + 1);
  input("d").value = String(n.getDate());
  input("h").value = String(n.getHours());
  input("mi").value = String(n.getMinutes());
}

function showError(msg: string): void {
  const el = $("error");
  el.textContent = msg;
  el.hidden = !msg;
}

function el(tag: string, cls?: string, text?: string): HTMLElement {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

function renderPillars(r: SajuResult): void {
  const box = $("pillars");
  box.replaceChildren();
  const names = ["年", "月", "日", "時"];
  const sj = r.sjGanzi;
  // 보통 사주는 시일월년 순서(오른쪽이 년)
  for (let k = 3; k >= 0; k--) {
    const col = el("div", "pillar");
    col.append(el("div", "pname", names[k]));
    const gan = el("div", "pc", toGan(sj[k][0]));
    gan.style.background = ganColor(sj[k][0]);
    const zi = el("div", "pc", toZi(sj[k][1]));
    zi.style.background = ziColor(sj[k][1]);
    col.append(gan, zi);
    if (k !== 2) col.append(el("div", "pyk", getGanYooksin(sj[2][0], sj[k][0])));
    else col.append(el("div", "pyk", "일간"));
    col.append(el("div", "pyk", getZiYooksin(sj[2][0], sj[k][1])));
    box.append(col);
  }
}

function renderDaeun(r: SajuResult): void {
  const box = $("daeun");
  box.replaceChildren();
  const nowAge = new Date().getFullYear() - new Date(r.realDt).getUTCFullYear();
  for (const d of r.daeun) {
    const c = el("div", "dae");
    if (d.startAge <= nowAge && nowAge < d.startAge + 10) c.classList.add("now");
    c.append(el("div", "age", String(d.startAge)), el("div", "gz", d.gan), el("div", "gz", d.zi));
    box.append(c);
  }
}

function renderGrid(r: SajuResult): void {
  const box = $("grid9");
  box.replaceChildren();
  for (const i of GRID_ORDER) {
    const v = cellView(r, i);
    const cell = el("div", "cell");
    if (v.isCenter) cell.classList.add("center");
    else if (v.hasJi) cell.classList.add("ji");
    for (const ln of v.lines) {
      const row = el("div", "ln", ln.text);
      if (ln.align === "right") row.classList.add("right");
      cell.append(row);
    }
    box.append(cell);
  }
}

function run(): void {
  showError("");
  const num = (id: string) => {
    const v = input(id).value.trim();
    if (!/^-?\d+$/.test(v)) throw new Error("bad");
    return parseInt(v, 10);
  };
  try {
    const y = num("y"), m = num("m"), d = num("d"), h = num("h"), mi = num("mi");
    if (m < 1 || m > 12 || d < 1 || d > 31 || h < 0 || h > 23 || mi < 0 || mi > 59) throw new Error("bad");
    const gender = parseInt((document.querySelector('input[name="gender"]:checked') as HTMLInputElement).value, 10);
    const cal = (document.querySelector('input[name="cal"]:checked') as HTMLInputElement).value;

    let r: SajuResult;
    const solarInput = cal === "solar";
    if (solarInput) {
      // 존재하지 않는 양력 날짜(2월 30일 등)는 오류로 처리
      const probe = new Date(Date.UTC(y, m - 1, d));
      if (probe.getUTCMonth() !== m - 1) throw new Error("bad");
      r = calculate(mk(y, m, d, h, mi), gender);
    } else {
      r = calculateLunar(y, m, d, h, mi, cal === "leap", gender);
    }

    $("dateLabel").textContent = `${input("name").value}  ·  ` + dateLabel(r, solarInput, h, mi);
    $("realLabel").textContent = "보정 시각 " + realTimeLabel(r);
    $("birth").textContent = r.birthJeolgi;
    renderPillars(r);
    renderDaeun(r);
    renderGrid(r);
    $("result").hidden = false;
  } catch {
    showError("년,월,일,시를 정확히 입력하세요");
    $("result").hidden = true;
  }
}

fillNow();
$("form").addEventListener("submit", (e) => { e.preventDefault(); run(); });
$("now").addEventListener("click", fillNow);
