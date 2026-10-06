import "./style.css";
import { toPng } from "html-to-image";
import {
  calculate, calculateLunar, findBirthDates, mk, year, month, day, hour, minute, toGan, toZi, SajuResult,
} from "./engine/index";
import { dateLabel } from "./ui/format";
import { checkGate, GateState } from "./gate";
import { ResultView } from "./ui/resultView";
import {
  Person, loadPeople, savePeople, addPerson, makeDate, parseDate, parseCsv, toCsv, personKey,
} from "./store";
import { calcSinsoo, defaultFields, editableFields, SinsooCal, SinsooMode } from "./sinsoo";

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
const p2 = (n: number) => (n < 10 ? "0" + n : "" + n);

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
function numOf(id: string): number {
  const v = input(id).value.trim();
  if (!/^-?\d+$/.test(v)) throw new Error("bad");
  return parseInt(v, 10);
}
function readInputs(): Inputs {
  const r = { y: numOf("y"), m: numOf("m"), d: numOf("d"), h: numOf("h"), mi: numOf("mi") };
  if (r.m < 1 || r.m > 12 || r.d < 1 || r.d > 31 || r.h < 0 || r.h > 23 || r.mi < 0 || r.mi > 59) throw new Error("bad");
  return r;
}

// ---------------------------------------------------------------- 결과 화면
// 입력 폼과 저장 목록은 기본 화면의 왼쪽 위에, 신수운 입력은 신수운 화면의 왼쪽 위에 놓는다. (원본 프로그램과 같은 배치)
const basicView = new ResultView({
  id: "basic", daeun: true, sinsoo: false,   leftTop: [$("form"), $("peoplePanel")],
});
const sinsooView = new ResultView({ id: "sinsoo", daeun: false, sinsoo: true, leftTop: [$("sinsooForm")] });
$("basicHost").append(basicView.root);
$("sinsooHost").append(sinsooView.root);
$("stash").remove();

function showResultBar(on: boolean): void { $("result").hidden = !on; $("headActions").hidden = !on; }

/** 신수운에 넘길 본인 정보 (마지막으로 성공한 계산) */
let person: { birthSolar: number; gender: 0 | 1; name: string } | null = null;

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
    const name = input("name").value.trim() || "이름없음";
    basicView.update(r, {
      title: `${name}  ·  ` + dateLabel(r, solarInput, h, mi),
      sub: "",
      birth: r.birthJeolgi,
    });
    person = { birthSolar: r.solarDt, gender: gender as 0 | 1, name };
    showResultBar(true);
    if (activeTab === "sinsoo") initSinsoo();     // 본인이 바뀌었으면 변국도 새로
    return true;
  } catch {
    showError("년,월,일,시를 정확히 입력하세요");
    showResultBar(false);
    basicView.clear();
    return false;
  }
}

// ---------------------------------------------------------------- 탭 (기문둔갑 / 신수운)
type Tab = "qimen" | "sinsoo" | "yunyun" | "hongguk";
const TAB_IDS: Record<Tab, string> = { qimen: "tabQimen", yunyun: "tabYunyun", hongguk: "tabHongguk", sinsoo: "tabSinsoo" };
let activeTab: Tab = "qimen";
function setTab(t: Tab): void {
  activeTab = t;
  (Object.keys(TAB_IDS) as Tab[]).forEach((k) => {
    const b = $(TAB_IDS[k]);
    b.classList.toggle("on", k === t);
    b.setAttribute("aria-selected", String(k === t));
  });
  const isBian = t === "sinsoo";
  $("basicHost").hidden = isBian;
  $("sinsooHost").hidden = !isBian;
  document.body.classList.toggle("sinsoo-active", isBian);
  if (isBian) initSinsoo();
  else basicView.setViewMode(t);       // 기문둔갑 / 유년소운 / 홍국기문은 같은 화면의 9궁 보기만 다르다
}

// ---------------------------------------------------------------- 신수운
const sinMode = () => (document.querySelector('input[name="sinMode"]:checked') as HTMLInputElement).value as SinsooMode;
const sinCal = () => (document.querySelector('input[name="sinCal"]:checked') as HTMLInputElement).value as SinsooCal;

/** 입력칸을 본인 생일 값으로 되돌리고, 국에 따라 고칠 수 있는 칸만 연다 */
function resetSinsooFields(): void {
  if (!person) return;
  const f = defaultFields(person.birthSolar, sinCal());
  input("sy").value = String(f.year); input("sm").value = String(f.month); input("sd").value = String(f.day);
  input("sh").value = String(f.hour); input("smi").value = String(f.minute);
  const ed = editableFields(sinMode());
  input("sy").disabled = false;           // 연도는 어느 국에서나 바꿀 수 있다
  input("sm").disabled = !ed.month;       // 나머지는 국에 따라 켜지고, 꺼진 칸은 본인 생일 값이 쓰인다
  input("sd").disabled = !ed.day;
  input("sh").disabled = !ed.time;
  input("smi").disabled = !ed.time;
}

function initSinsoo(): void {
  if (!person) return;
  resetSinsooFields();
  runSinsoo();
}

function runSinsoo(): void {
  const err = $("sinError");
  err.hidden = true;
  if (!person) return;
  try {
    const mode = sinMode(), cal = sinCal();
    const y = numOf("sy"), m = numOf("sm"), d = numOf("sd"), h = numOf("sh"), mi = numOf("smi");
    if (m < 1 || m > 12 || d < 1 || d > 31 || h < 0 || h > 23 || mi < 0 || mi > 59) throw new Error("bad");
    if (cal === "solar" && new Date(Date.UTC(y, m - 1, d)).getUTCMonth() !== m - 1) throw new Error("bad");
    const s = calcSinsoo({ birthSolar: person.birthSolar, gender: person.gender, calendar: cal, mode, year: y, month: m, day: d, hour: h, minute: mi });
    const r = s.result;
    sinsooView.update(r, {
      title: `${person.name}  ·  ${y}년 변국 (${{ year: "年局", month: "月局", day: "日局", time: "時局" }[mode]})`,
      sub: dateLabel(r, cal === "solar", cal === "solar" ? h : hour(person.birthSolar), cal === "solar" ? mi : minute(person.birthSolar)),
      birth: r.birthJeolgi,
      extra: `행년 ${s.hyear}궁 (${s.age}세)`,
    }, { hyear: s.hyear, monthMode: s.monthMode });
  } catch {
    err.textContent = "년,월,일,시를 정확히 입력하세요";
    err.hidden = false;
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
  $("go").textContent = pillars ? "생일시 찾기" : "조회";
  $("save").hidden = pillars;
}

// ---------------------------------------------------------------- 저장된 사람
let people: Person[] = loadPeople(storage);
type PeopleSort = "name" | "date" | "recent";
let peopleSort: PeopleSort = "name";

function persist(): void {
  if (!savePeople(storage, people)) showError("이 브라우저에서는 저장할 수 없습니다 (시크릿 모드이거나 저장소가 막혀 있음)");
}

function renderPeople(): void {
  const filter = input("filter").value.trim();
  const indexed = people.map((p, i) => ({ p, i }));
  const rows = indexed
    .filter(({ p }) => !filter || p.name.includes(filter) || p.note.includes(filter))
    .sort((a, b) => {
      if (peopleSort === "recent") return b.i - a.i;                          // 나중에 저장한 사람이 위
      const x = peopleSort === "name" ? a.p.name : a.p.date;
      const y = peopleSort === "name" ? b.p.name : b.p.date;
      return x < y ? -1 : x > y ? 1 : 0;
    })
    .map(({ p }) => p);

  const list = $("peopleList");
  list.replaceChildren();
  $("peopleEmpty").hidden = rows.length > 0;
  $("peopleEmpty").textContent = people.length === 0 ? "저장된 사람이 없습니다." : "검색 결과가 없습니다.";

  for (const p of rows) {
    const dd = parseDate(p.date);
    const li = el("li", "person");

    const main = el("button", "p-main");
    (main as HTMLButtonElement).type = "button";
    main.title = "눌러서 불러오기";
    const nm = el("span", "p-name", p.name);
    nm.append(el("span", "p-gender " + (p.gender === "남자" ? "m" : "f"), p.gender === "남자" ? "남" : "여"));
    main.append(nm, el("span", "p-meta", `${dd.y}-${p2(dd.m)}-${p2(dd.d)} ${p2(dd.h)}:${p2(dd.mi)} · ${p.cal}`));
    main.addEventListener("click", () => loadPerson(p));

    const act = el("div", "p-actions");
    const load = el("button", "ghost sm", "불러오기") as HTMLButtonElement;
    load.type = "button";
    load.addEventListener("click", () => loadPerson(p));
    const del = el("button", "ghost sm danger icon", "삭제") as HTMLButtonElement;
    del.type = "button";
    del.setAttribute("aria-label", `${p.name} 삭제`);
    del.addEventListener("click", () => {
      if (!window.confirm(`'${p.name}' 을(를) 삭제할까요?`)) return;
      people = people.filter((q) => personKey(q) !== personKey(p));
      persist(); renderPeople();
    });
    act.append(load, del);

    const note = document.createElement("input");
    note.type = "text"; note.value = p.note; note.className = "note"; note.placeholder = "비고"; note.setAttribute("aria-label", "비고");
    note.addEventListener("change", () => { p.note = note.value.replace(/,/g, ".").replace(/\r?\n/g, "/"); persist(); });

    li.append(main, act, note);
    list.append(li);
  }
}

function setPeopleOpen(open: boolean): void {
  $("peoplePanel").hidden = !open;
  $("peopleBtn").setAttribute("aria-expanded", String(open));
  $("peopleBtn").classList.toggle("on", open);
}

function loadPerson(p: Person): void {
  setPeopleOpen(false);
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

// ---------------------------------------------------------------- 인쇄 / 이미지 저장
async function savePng(): Promise<void> {
  const view = activeTab === "sinsoo" ? sinsooView : basicView;
  const tabName = { qimen: "기문둔갑", sinsoo: "변국", yunyun: "유년소운", hongguk: "홍국기문" }[activeTab];
  document.documentElement.dataset.theme = "light";     // 다크 모드여도 이미지는 밝은 색으로
  document.documentElement.classList.add("exporting");  // 입력 폼 등은 감춰서 그 자리가 빈 공간으로 남지 않게
  try {
    const url = await toPng(view.root, {
      pixelRatio: 2,
      backgroundColor: "#f4f1ea",
      filter: (n) => !(n instanceof HTMLElement && n.classList.contains("no-export")),
    });
    const a = document.createElement("a");
    const who = person?.name ?? "기문명리";
    a.href = url;
    a.download = `${who}_${tabName}.png`;
    a.click();
  } catch {
    showError("이미지를 만들 수 없습니다");
  } finally {
    delete document.documentElement.dataset.theme;
    document.documentElement.classList.remove("exporting");
  }
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
$("print").addEventListener("click", () => window.print());
$("savePng").addEventListener("click", () => void savePng());
$("save").addEventListener("click", savePerson);
$("peopleBtn").addEventListener("click", () => setPeopleOpen($("peoplePanel").hidden === true));
$("peopleClose").addEventListener("click", () => setPeopleOpen(false));
document.querySelectorAll('input[name="cal"]').forEach((r) => r.addEventListener("change", applyCalMode));
input("filter").addEventListener("input", renderPeople);
$("export").addEventListener("click", exportCsv);
input("import").addEventListener("change", (e) => {
  const f = (e.target as HTMLInputElement).files?.[0];
  if (f) void importCsv(f).finally(() => ((e.target as HTMLInputElement).value = ""));
});
document.querySelectorAll('input[name="psort"]').forEach((r) =>
  r.addEventListener("change", () => { peopleSort = (r as HTMLInputElement).value as PeopleSort; renderPeople(); }));


(Object.keys(TAB_IDS) as Tab[]).forEach((k) => $(TAB_IDS[k]).addEventListener("click", () => setTab(k)));
$("sinsooForm").addEventListener("submit", (e) => { e.preventDefault(); runSinsoo(); });
document.querySelectorAll('input[name="sinMode"], input[name="sinCal"]').forEach((r) =>
  r.addEventListener("change", () => { resetSinsooFields(); runSinsoo(); }));

// ---------------------------------------------------------------- 사용 허가 확인
function showLock(st: Extract<GateState, { ok: false }>): void {
  document.body.classList.add("locked");
  if (document.getElementById("lockscreen")) return;
  const msg = st.reason === "stopped"
    ? "이 서비스는 현재 사용이 중단되었습니다."
    : st.reason === "expired"
      ? "오프라인으로 사용할 수 있는 기간(7일)이 지났습니다. 인터넷에 연결한 뒤 다시 열어 주세요."
      : "처음 사용하려면 인터넷 연결이 필요합니다.";
  const box = document.createElement("div");
  box.id = "lockscreen";
  box.className = "lockscreen";
  box.innerHTML = `<div><h2>기문명리</h2><p></p><button type="button">다시 확인</button></div>`;
  box.querySelector("p")!.textContent = msg;
  box.querySelector("button")!.addEventListener("click", () => void refreshGate());
  document.body.appendChild(box);
}
function unlock(): void {
  document.body.classList.remove("locked");
  document.getElementById("lockscreen")?.remove();
}
async function refreshGate(): Promise<void> {
  const st = await checkGate();
  if (st.ok) unlock(); else showLock(st);
}
void refreshGate();
document.addEventListener("visibilitychange", () => { if (!document.hidden) void refreshGate(); });
window.setInterval(() => void refreshGate(), 30 * 60 * 1000);
