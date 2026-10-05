import "./style.css";
import { toPng } from "html-to-image";
import {
  calculate, calculateLunar, findBirthDates, mk, year, month, day, hour, minute, toGan, toZi, SajuResult,
} from "./engine/index";
import { dateLabel, realTimeLabel } from "./ui/format";
import { ResultView } from "./ui/resultView";
import {
  Person, loadPeople, savePeople, addPerson, makeDate, parseDate, parseCsv, toCsv, personKey,
} from "./store";
import { currentState, describeState, verifyKey, storeKey, LicenseState } from "./license/license";
import { PUBLIC_KEY } from "./license/publicKey";
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

// ---------------------------------------------------------------- 라이선스 (체험판 5개월 / 정품키)
let lic: LicenseState | null = null;
const isBlocked = () => lic === null || lic.kind === "expired";

async function refreshLicense(): Promise<void> {
  lic = await currentState(storage, PUBLIC_KEY);
  $("licenseStatus").textContent = describeState(lic);
  $("licenseBtn").classList.toggle("warn", lic.kind === "expired" || (lic.kind === "trial" && lic.daysLeft <= 14));
  if (lic.kind === "expired") openLicense();
  else if (!$("licenseModal").hidden && gateOpen) closeLicense();
}

let gateOpen = false;
function openLicense(): void {
  const s = lic;
  const modal = $("licenseModal");
  const expired = s?.kind === "expired";
  gateOpen = expired;
  $("licTitle").textContent = expired ? "사용기한이 만료되었습니다" : "라이선스";
  let text = "";
  if (!s) text = "확인 중입니다…";
  else if (s.kind === "licensed") text = `정품으로 등록되어 있습니다. (${s.info.name}` + (s.info.expires ? `, ${s.info.expires}까지)` : ", 기한 없음)");
  else if (s.kind === "trial") text = `체험판을 사용 중입니다. ${s.expiresOn}까지 ${s.daysLeft}일 남았습니다.`;
  else text = "체험 기간(5개월)이 끝났습니다." + (s.keyProblem === "expired" ? " 등록된 정품키의 사용 기간도 끝났습니다." : "") + " 정품키를 입력하면 계속 사용할 수 있습니다.";
  $("licText").textContent = text;
  $("licClose").hidden = expired;                 // 만료되면 닫을 수 없다
  $("licError").hidden = true;
  modal.hidden = false;
  (document.getElementById("app") as HTMLElement).inert = true;
  input("licenseKey").focus();
}
function closeLicense(): void {
  if (isBlocked()) return;
  $("licenseModal").hidden = true;
  gateOpen = false;
  (document.getElementById("app") as HTMLElement).inert = false;
}

async function registerKey(): Promise<void> {
  const err = $("licError");
  const key = input("licenseKey").value;
  const r = await verifyKey(key, PUBLIC_KEY);
  if (!r.ok) {
    err.textContent = r.reason === "expired" && r.info
      ? `${r.info.name}님의 정품키는 ${r.info.expires}에 사용 기간이 끝났습니다.`
      : r.reason === "format" ? "정품키 형식이 올바르지 않습니다. 전체를 그대로 붙여넣었는지 확인하세요." : "올바르지 않은 정품키입니다.";
    err.hidden = false;
    return;
  }
  if (!storeKey(storage, key)) {
    err.textContent = "이 브라우저에서는 정품키를 저장할 수 없습니다 (시크릿 모드이거나 저장소가 막혀 있음).";
    err.hidden = false;
    return;
  }
  input("licenseKey").value = "";
  await refreshLicense();
  $("licenseModal").hidden = true;
  gateOpen = false;
  (document.getElementById("app") as HTMLElement).inert = false;
  showMsg(`정품이 등록되었습니다. (${r.info.name})`);
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

function showResultBar(on: boolean): void { $("result").hidden = !on; }

/** 신수운에 넘길 본인 정보 (마지막으로 성공한 계산) */
let person: { birthSolar: number; gender: 0 | 1; name: string } | null = null;

/** 날짜 입력으로 계산해서 화면에 보인다. 성공하면 true */
function run(): boolean {
  showError("");
  if (isBlocked()) { openLicense(); return false; }
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
      sub: "보정 시각 " + realTimeLabel(r),
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
const TAB_IDS: Record<Tab, string> = { qimen: "tabQimen", sinsoo: "tabSinsoo", yunyun: "tabYunyun", hongguk: "tabHongguk" };
let activeTab: Tab = "qimen";
function setTab(t: Tab): void {
  activeTab = t;
  (Object.keys(TAB_IDS) as Tab[]).forEach((k) => $(TAB_IDS[k]).classList.toggle("on", k === t));
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
  if (isBlocked()) { openLicense(); return; }
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
      sub: dateLabel(r, cal === "solar", cal === "solar" ? h : hour(person.birthSolar), cal === "solar" ? mi : minute(person.birthSolar))
        + "   ·   보정 시각 " + realTimeLabel(r),
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
  if (isBlocked()) { openLicense(); return; }
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

$("licenseBtn").addEventListener("click", openLicense);
$("licClose").addEventListener("click", closeLicense);
$("licRegister").addEventListener("click", () => void registerKey());
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !isBlocked()) closeLicense(); });
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") void refreshLicense(); });
window.setInterval(() => void refreshLicense(), 60 * 60 * 1000);
void refreshLicense();

(Object.keys(TAB_IDS) as Tab[]).forEach((k) => $(TAB_IDS[k]).addEventListener("click", () => setTab(k)));
$("sinsooForm").addEventListener("submit", (e) => { e.preventDefault(); runSinsoo(); });
document.querySelectorAll('input[name="sinMode"], input[name="sinCal"]').forEach((r) =>
  r.addEventListener("change", () => { resetSinsooFields(); runSinsoo(); }));
