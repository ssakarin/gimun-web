// 유년소운: 9궁 각 칸에 나이를 차례로 적어 넣는다. (원본 Form1.Yunyun)
// 년주의 60갑자 순번 k 를 바탕으로 1세부터 90세까지를 9궁에 돌려가며 배치한다.
import { SajuResult, toGan, toZi } from "../engine/index";

const DAY = [
  ["甲子", "乙丑", "丙寅", "丁卯", "戊辰", "己巳", "庚午", "辛未", "壬申", "癸酉"],
  ["甲戌", "乙亥", "丙子", "丁丑", "戊寅", "己卯", "庚辰", "辛巳", "壬午", "癸未"],
  ["甲申", "乙酉", "丙戌", "丁亥", "戊子", "己丑", "庚寅", "辛卯", "壬辰", "癸巳"],
  ["甲午", "乙未", "丙申", "丁酉", "戊戌", "己亥", "庚子", "辛丑", "壬寅", "癸卯"],
  ["甲辰", "乙巳", "丙午", "丁未", "戊申", "己酉", "庚戌", "辛亥", "壬子", "癸丑"],
  ["甲寅", "乙卯", "丙辰", "丁巳", "戊午", "己未", "庚申", "辛酉", "壬戌", "癸亥"],
];

/** 각 칸(궁 번호 - 1)에 이어 붙일 나이 목록 글자 */
export function yunyun(r: SajuResult): string[] {
  const out: string[] = Array.from({ length: 9 }, () => "");
  const g = r.goong, dir = r.direction;
  const cellAt = (j: number, start: number) => (dir ? (j + start) % 9 : (start + 9 - j) % 9);

  const temp = toGan(r.sjGanzi[0][0]) + toZi(r.sjGanzi[0][1]);
  let k: number;
  for (k = 0; k < 60 && DAY[Math.trunc(k / 10)][k % 10] !== temp; k++);
  let start = (Math.trunc(k / 10) + (k % 10)) % 9;
  let i: number, j: number;
  for (i = 0; i < 9 && g[i].yooksam[1] !== start; i++);
  start = i;

  // 1단계: 1세부터, 년주가 한 바퀴(60) 돌아오는 나이까지
  let tAge = 0;
  phase1:
  for (i = 0; i < 9; i++) {
    for (j = 0; j < 9; j++) {
      const idx = cellAt(j, start);
      const age = i * 9 + (j % 9) + 1;
      if (i !== 0) out[idx] += ", ";
      out[idx] += String(age);
      if (age + k === 60) { tAge = age; break phase1; }
    }
  }

  // 2단계: 戊(지반 육의삼기 0)가 있는 궁에서 다시 시작해 120 이 될 때까지
  for (i = 0; i < 9 && g[i].yooksam[1] !== 0; i++);
  start = i;
  phase2:
  for (i = 0; i < 9; i++) {
    for (j = 0; j < 9; j++) {
      const idx = cellAt(j, start);
      const age = i * 9 + (j % 9) + 1 + tAge;
      out[idx] += ", " + age;
      if (age + k === 120) { tAge = age; break phase2; }
    }
  }

  // 3단계: 90세까지
  for (i = 0; i < 9 && g[i].yooksam[1] !== 0; i++);
  start = i;
  phase3:
  for (i = 0; i < 9; i++) {
    for (j = 0; j < 9; j++) {
      const idx = cellAt(j, start);
      const age = tAge + i * 9 + (j % 9) + 1;
      if (age > 90) break phase3;
      out[idx] += ", " + age;
    }
  }
  return out;
}
