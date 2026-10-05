import { describe, it, expect } from "vitest";
import {
  Person, addPerson, makeDate, parseDate, parseCsv, parseCsvLine, toCsv, toCsvLine, loadPeople, savePeople, KeyValueStorage,
} from "../src/store";

const p1: Person = { name: "홍길동", gender: "남자", date: "1990_05_17_1430", cal: "양력", note: "" };

describe("저장 목록", () => {
  it("날짜 문자열 변환", () => {
    expect(makeDate(1990, 5, 7, 4, 9)).toBe("1990_05_07_0409");
    expect(parseDate("1990_05_07_0409")).toEqual({ y: 1990, m: 5, d: 7, h: 4, mi: 9 });
  });

  it("원본 data.csv 한 줄을 읽고 같은 줄로 쓴다", () => {
    const line = "홍길동,남자,1990_05_17_1430,양력,";   // 처음 저장할 때 원본이 쓰는 줄
    expect(parseCsvLine(line)).toEqual(p1);
    expect(toCsvLine(p1)).toBe(line + ",");              // 비고 칸을 포함해 쓴다(원본 수정 화면과 같음)
    expect(parseCsvLine("김,여자,2000_01_01_0000,음력윤달,메모/둘째,")).toEqual(
      { name: "김", gender: "여자", date: "2000_01_01_0000", cal: "음력윤달", note: "메모/둘째" });
  });

  it("양음력이 비어 있으면 양력", () => {
    expect(parseCsvLine("a,남자,1990_05_17_1430,,")?.cal).toBe("양력");
  });

  it("잘못된 줄은 건너뛴다", () => {
    expect(parseCsv("이상한줄\n\n홍길동,남자,1990_05_17_1430,양력,\nx,남자,19900517,양력,\n")).toEqual([p1]);
  });

  it("같은 사람은 두 번 저장되지 않는다", () => {
    const list: Person[] = [];
    expect(addPerson(list, p1)).toBe(true);
    expect(addPerson(list, { ...p1, note: "다른 비고" })).toBe(false);
    expect(addPerson(list, { ...p1, cal: "음력" })).toBe(true);
  });

  it("쉼표와 줄바꿈은 비고에서 바꿔서 쓴다", () => {
    expect(toCsvLine({ ...p1, note: "a,b\nc" })).toBe("홍길동,남자,1990_05_17_1430,양력,a.b/c,");
    expect(toCsv([p1])).toBe("홍길동,남자,1990_05_17_1430,양력,,\r\n");
  });

  it("저장소에 넣고 꺼낸다 / 저장소가 없어도 죽지 않는다", () => {
    const mem = new Map<string, string>();
    const st: KeyValueStorage = { getItem: (k) => mem.get(k) ?? null, setItem: (k, v) => void mem.set(k, v) };
    expect(savePeople(st, [p1])).toBe(true);
    expect(loadPeople(st)).toEqual([p1]);
    expect(loadPeople(null)).toEqual([]);
    expect(savePeople(null, [p1])).toBe(false);
    mem.set("gimun.people", "{깨진 json");
    expect(loadPeople(st)).toEqual([]);
  });
});
