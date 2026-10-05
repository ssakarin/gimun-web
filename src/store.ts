// 저장된 사람 목록. 원본 프로그램의 data.csv 와 같은 줄 형식을 쓰므로 서로 가져오고 내보낼 수 있다.
//   이름,남자,2024_03_05_0709,양력,비고,
export interface Person {
  name: string;
  gender: "남자" | "여자";
  date: string;            // yyyy_MM_dd_HHmm  (음력이면 음력 연월일 그대로)
  cal: "양력" | "음력" | "음력윤달";
  note: string;
}

export interface KeyValueStorage {
  getItem(k: string): string | null;
  setItem(k: string, v: string): void;
}

const KEY = "gimun.people";

export function personKey(p: Person): string {
  return [p.name, p.gender, p.date, p.cal].join(",");
}

export function loadPeople(st: KeyValueStorage | null): Person[] {
  try {
    const raw = st?.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter(isPerson) : [];
  } catch {
    return [];
  }
}

export function savePeople(st: KeyValueStorage | null, list: Person[]): boolean {
  try {
    st?.setItem(KEY, JSON.stringify(list));
    return !!st;
  } catch {
    return false;
  }
}

function isPerson(x: unknown): x is Person {
  const p = x as Person;
  return !!p && typeof p.name === "string" && typeof p.date === "string" && /^\d{4}_\d\d_\d\d_\d{4}$/.test(p.date)
    && (p.gender === "남자" || p.gender === "여자") && (p.cal === "양력" || p.cal === "음력" || p.cal === "음력윤달")
    && typeof p.note === "string";
}

/** 같은 사람(이름, 성별, 일시, 양음력이 같음)이 이미 있으면 false */
export function addPerson(list: Person[], p: Person): boolean {
  if (list.some((q) => personKey(q) === personKey(p))) return false;
  list.push(p);
  return true;
}

/** 입력칸 값 -> yyyy_MM_dd_HHmm */
export function makeDate(y: number, m: number, d: number, h: number, mi: number): string {
  const z = (n: number, w: number) => String(n).padStart(w, "0");
  return `${z(y, 4)}_${z(m, 2)}_${z(d, 2)}_${z(h, 2)}${z(mi, 2)}`;
}

export function parseDate(s: string): { y: number; m: number; d: number; h: number; mi: number } {
  const [y, m, d, hm] = s.split("_");
  return { y: +y, m: +m, d: +d, h: +hm.slice(0, 2), mi: +hm.slice(2, 4) };
}

/** data.csv 한 줄 -> 사람. 형식이 맞지 않으면 null */
export function parseCsvLine(line: string): Person | null {
  const f = line.replace(/\r$/, "").split(",");
  if (f.length < 4) return null;
  const cal = f[3] === "" ? "양력" : f[3];
  const p = { name: f[0], gender: f[1], date: f[2], cal, note: f[4] ?? "" } as Person;
  return isPerson(p) ? p : null;
}

export function parseCsv(text: string): Person[] {
  const out: Person[] = [];
  for (const line of text.split("\n")) {
    if (!line.trim()) continue;
    const p = parseCsvLine(line);
    if (p) addPerson(out, p);
  }
  return out;
}

/** 사람 -> data.csv 한 줄 (쉼표/줄바꿈은 비고에서 바꿔 넣는다: 원본과 같은 규칙) */
export function toCsvLine(p: Person): string {
  const clean = (s: string) => s.replace(/,/g, ".").replace(/\r?\n/g, "/");
  return [clean(p.name), p.gender, p.date, p.cal, clean(p.note)].join(",") + ",";
}

export function toCsv(list: Person[]): string {
  return list.map(toCsvLine).join("\r\n") + (list.length ? "\r\n" : "");
}
