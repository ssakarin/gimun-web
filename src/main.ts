import "./style.css";
import {
  calculate, calculateLunar, findBirthDates, mk, year, month, day, hour, minute,
  toGan, toZi, getZiYooksin, getGanYooksin, SajuResult,
} from "./engine/index";
import { renderTongi } from "./ui/tongiView";
import { cellView, dateLabel, realTimeLabel, ganColor, ziColor, GRID_ORDER } from "./ui/format";
import {
  Person, loadPeople, savePeople, addPerson, makeDate, parseDate, parseCsv, toCsv, personKey,
} from "./store";

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const input = (id: string) => $<HTMLInputElement>(id);

function el(tag: string, cls?: string, text?: string): HTMLElement {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

function safeStorage(): Storage | null {
  try { return window.localStorage; } catch { return null; }
}
const storage = safeStorage();

// ---------------------------------------------------------------- 메시지
function showError(msg: string): void {
  const e = $("error"); e.textContent = msg; e.hidden = !msg;
  if (msg) $("msg").hidden = true;
}
let msgTimer: number | undefined;
function showMsg(msg: string): void {
  const e = $("msg"); e.textContent = msg; e.hidden = !msg;
  window.clearTimeout(msgTimer);
  if (msg) msgTimer = window.setTimeout(() => (e.hidden = true), 4000);
}

// ---------------------------------------------------------------- 입력값
function fillNow(): void {
  const n = new Date();
  input("y").value = String(n.getFullYear());
  input("m").value = String(n.getMonth() + 1);
  input("d").value = String(n.getDate());
  input("h").value = String(n.getHours());
  input("mi").value = String(n.getMinutes());
}

const calValue = () => (document.querySelector('input[name="cal"]:checked') as HTMLInputElement).value;
const genderValue = () => parseInt((document.querySelector('input[name="gender"]:checked') as HTMLInputElement).value, 10);
function setRadio(name: string, value: string): void {
  (document.querySelector(`input[name="${name}"][value="${value}"]`) as HTMLInputElement).checked = true;
}

interface Inputs { y: number; m: number; d: number; h: number; mi: number }
function readInputs(): Inputs {
  const num = (id: string) => {
    const v = input(id).value.trim();
    if (!/^-?\d+$/.test(v)) throw new Error("bad");
    return parseInt(v, 10);
  };
  const r = { y: num("y"), m: num("m"), d: num("d"), h: num("h"), mi: num("mi") };
  if (r.m < 1 || r.m > 12 || r.d < 1 || r.d > 31 || r.h < 0 || r.h > 23 || r.mi < 0 || r.mi > 59) throw new Error("bad");
  return r;
}

// ---------------------------------------------------------------- 결과 그리기
function renderPillars(r: SajuResult): void {
  const box = $("pillars");
  box.replaceChildren();
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
    box.append(col);
  }
}

function renderDaeun(r: SajuResult): void {
  const box = $("daeun");
  box.replaceChildren();
  const nowAge = new Date().getFullYear() - year(r.realDt);
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

let lastResult: SajuResult | null = null;
const tongiMode = () => (parseInt((document.querySelector('input[name="tongi"]:checked') as HTMLInputElement).value, 10) as 1 | 2);
function drawTongi(): void {
  if (lastResult) renderTongi($("tongi"), lastResult.goong, tongiMode());
}

/** 날짜 입력으로 계산해서 화면에 보인다. 성공하면 true */
function run(): boolean {
  showError("");
  try {
    const { y, m, d, h, mi } = readInputs();
    const gender = genderValue();
    const cal = calValue();
    const solarInput = cal === "solar";
    let r: SajuResult;
    if (solarInput) {
      const probe = new Date(Date.UTC(y, m - 1, d));      // 존재하지 않는 날짜(2월 30일 등)는 오류
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
    lastResult = r;
    $("result").hidden = false;
    drawTongi();
    return true;
  } catch {
    showError("년,월,일,시를 정확히 입력하세요");
    $("result").hidden = true;
    return false;
  }
}

// ---------------------------------------------------------------- 사주(간지) 입력
const pillarSel: HTMLSelectElement[] = [];   // [년간, 년지, 월간, 월지, 일간, 일지, 시간, 시지]

function buildPillarInputs(): void {
  const grid = $("pgrid");
  const names = ["年", "月", "日", "時"];
  for (let k = 0; k < 4; k++) {
    const col = el("div", "pcol");
    col.append(el("div", "pname", names[k]));
    for (const kind of [0, 1]) {
      const s = document.createElement("select");
      const n = kind === 0 ? 10 : 12;
      for (let v = 1; v <= n; v++) {
        const o = document.createElement("option");
        o.value = String(v);
        o.textContent = kind === 0 ? toGan(v) : toZi(v);
        s.append(o);
      }
      s.addEventListener("change", () => ($("candidates").replaceChildren()));
      pillarSel.push(s);
      col.append(s);
    }
    grid.append(col);
  }
}

function readPillars(): number[][] {
  return [0, 1, 2, 3].map((k) => [parseInt(pillarSel[k * 2].value, 10), parseInt(pillarSel[k * 2 + 1].value, 10)]);
}

const p2 = (n: number) => (n < 10 ? "0" + n : "" + n);

function findFromPillars(): void {
  showError("");
  const box = $("candidates");
  box.replaceChildren();
  const { found } = findBirthDates(readPillars());
  if (found.length === 0) {
    box.append(el("p", "muted", "이 사주에 해당하는 생일시가 없습니다."));
    return;
  }
  box.append(el("p", "muted", "해당하는 생일시를 고르세요."));
  for (const t of found) {
    const b = el("button", "ghost cand", `${year(t)}년 ${month(t)}월 ${day(t)}일 ${p2(hour(t))}:${p2(minute(t))}`) as HTMLButtonElement;
    b.type = "button";
    b.addEventListener("click", () => {
      input("y").value = String(year(t)); input("m").value = String(month(t)); input("d").value = String(day(t));
      input("h").value = String(hour(t)); input("mi").value = String(minute(t));
      setRadio("cal", "solar");
      applyCalMode();
      box.replaceChildren();
      run();
    });
    box.append(b);
  }
}

function applyCalMode(): void {
  const pillars = calValue() === "pillars";
  $("dtRow").hidden = pillars;
  $("pillarsInput").hidden = !pillars;
  $("go").textContent = pillars ? "생일시 찾기" : "기문둔갑";
  $("save").hidden = pillars;
}

// ---------------------------------------------------------------- 저장된 사람
let people: Person[] = loadPeople(storage);
let sortKey: keyof Person = "name";
let sortAsc = true;

function persist(): void {
  if (!savePeople(storage, people)) showError("이 브라우저에서는 저장할 수 없습니다 (시크릿 모드이거나 저장소가 막혀 있음)");
}

function renderPeople(): void {
  const filter = input("filter").value.trim();
  const rows = people
    .filter((p) => !filter || p.name.includes(filter) || p.note.includes(filter))
    .sort((a, b) => (a[sortKey] < b[sortKey] ? -1 : a[sortKey] > b[sortKey] ? 1 : 0) * (sortAsc ? 1 : -1));
  $("peopleCount").textContent = people.length ? `(${people.length}명)` : "";
  const tb = document.querySelector("#peopleTable tbody") as HTMLElement;
  tb.replaceChildren();
  document.querySelectorAll("#peopleTable th[data-k]").forEach((th) => {
    const k = (th as HTMLElement).dataset.k!;
    th.textContent = th.textContent!.replace(/ [▲▼]$/, "") + (k === sortKey ? (sortAsc ? " ▲" : " ▼") : "");
  });
  for (const p of rows) {
    const tr = document.createElement("tr");
    const dd = parseDate(p.date);
    tr.append(el("td", "", p.name), el("td", "", p.gender === "남자" ? "남" : "여"),
      el("td", "", `${dd.y}-${p2(dd.m)}-${p2(dd.d)} ${p2(dd.h)}:${p2(dd.mi)}`), el("td", "", p.cal));
    const noteTd = document.createElement("td");
    const note = document.createElement("input");
    note.type = "text"; note.value = p.note; note.className = "note"; note.setAttribute("aria-label", "비고");
    note.addEventListener("change", () => { p.note = note.value.replace(/,/g, ".").replace(/\r?\n/g, "/"); persist(); });
    noteTd.append(note);
    const act = document.createElement("td");
    const load = el("button", "ghost sm", "불러오기") as HTMLButtonElement;
    load.type = "button";
    load.addEventListener("click", () => loadPerson(p));
    const del = el("button", "ghost sm danger", "삭제") as HTMLButtonElement;
    del.type = "button";
    del.addEventListener("click", () => {
      if (!window.confirm(`'${p.name}' 을(를) 삭제할까요?`)) return;
      people = people.filter((q) => personKey(q) !== personKey(p));
      persist(); renderPeople();
    });
    act.append(load, del);
    tr.append(noteTd, act);
    tb.append(tr);
  }
}

function loadPerson(p: Person): void {
  const d = parseDate(p.date);
  input("name").value = p.name;
  setRadio("gender", p.gender === "남자" ? "1" : "0");
  setRadio("cal", p.cal === "양력" ? "solar" : p.cal === "음력" ? "lunar" : "leap");
  input("y").value = String(d.y); input("m").value = String(d.m); input("d").value = String(d.d);
  input("h").value = String(d.h); input("mi").value = String(d.mi);
  applyCalMode();
  if (run()) window.scrollTo({ top: 0, behavior: "smooth" });
}

function savePerson(): void {
  if (!run()) return;
  const { y, m, d, h, mi } = readInputs();
  const cal = calValue();
  const p: Person = {
    name: input("name").value.trim().replace(/,/g, ".") || "이름없음",
    gender: genderValue() === 1 ? "남자" : "여자",
    date: makeDate(y, m, d, h, mi),
    cal: cal === "solar" ? "양력" : cal === "lunar" ? "음력" : "음력윤달",
    note: "",
  };
  if (!addPerson(people, p)) { showMsg("이미 저장된 사람입니다"); return; }
  persist(); renderPeople();
  showMsg(`'${p.name}' 을(를) 저장했습니다`);
}

function exportCsv(): void {
  if (!people.length) { showMsg("저장된 사람이 없습니다"); return; }
  const blob = new Blob([toCsv(people)], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "data.csv";
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

async function importCsv(file: File): Promise<void> {
  const text = await file.text();
  const list = parseCsv(text.replace(/^﻿/, ""));
  let added = 0;
  for (const p of list) if (addPerson(people, p)) added++;
  persist(); renderPeople();
  showMsg(`${list.length}명 중 ${added}명을 추가했습니다`);
}

// ---------------------------------------------------------------- 시작
fillNow();
buildPillarInputs();
applyCalMode();
renderPeople();

$("form").addEventListener("submit", (e) => {
  e.preventDefault();
  if (calValue() === "pillars") findFromPillars();
  else run();
});
$("now").addEventListener("click", fillNow);
document.querySelectorAll('input[name="tongi"]').forEach((r) => r.addEventListener("change", drawTongi));
$("save").addEventListener("click", savePerson);
document.querySelectorAll('input[name="cal"]').forEach((r) => r.addEventListener("change", applyCalMode));
input("filter").addEventListener("input", renderPeople);
$("export").addEventListener("click", exportCsv);
input("import").addEventListener("change", (e) => {
  const f = (e.target as HTMLInputElement).files?.[0];
  if (f) void importCsv(f).finally(() => ((e.target as HTMLInputElement).value = ""));
});
document.querySelectorAll("#peopleTable th[data-k]").forEach((th) =>
  th.addEventListener("click", () => {
    const k = (th as HTMLElement).dataset.k as keyof Person;
    if (k === sortKey) sortAsc = !sortAsc; else { sortKey = k; sortAsc = true; }
    renderPeople();
  }));
