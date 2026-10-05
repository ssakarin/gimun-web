// 계산 결과를 화면에 보여줄 글자로 바꾸는 부분 (C# showGoongLabelText 등에 해당). DOM 을 쓰지 않아 시험하기 쉽다.
import {
  SajuResult, Goong, toOhaeng_1, getohaeng, toFourgan, toCheonMaRok, bokgankyuk, toHongNumLvl, setBatangguk1,
  getPakjehwaeui, to8Mun, to8Mun2, to8Goe, toNum, toYookSam, toGooSung, toSixSin, toTaeulGusung, toMunWang,
  year, month, day, hour, minute,
} from "../engine/index";

/** 천간 오행 색 (getGancolor) */
export function ganColor(gan: number): string {
  if (gan === 1 || gan === 2) return "#90ee90";   // 목
  if (gan === 3 || gan === 4) return "#ffc0cb";   // 화
  if (gan === 5 || gan === 6) return "#f5deb3";   // 토
  if (gan === 7 || gan === 8) return "#ffffff";   // 금
  return "#808080";                               // 수
}

/** 지지 오행 색 (getZicolor) */
export function ziColor(zi: number): string {
  if (zi === 3 || zi === 4) return "#90ee90";
  if (zi === 6 || zi === 7) return "#ffc0cb";
  if (zi === 2 || zi === 5 || zi === 8 || zi === 11) return "#f5deb3";
  if (zi === 9 || zi === 10) return "#ffffff";
  return "#808080";
}

/** 화면 배치(낙서): 위에서 아래, 왼쪽에서 오른쪽 = 4 9 2 / 3 5 7 / 8 1 6 궁 */
export const GRID_ORDER = [3, 8, 1, 2, 4, 6, 7, 0, 5];   // goong 배열 인덱스 (궁번호 - 1)

const p2 = (n: number) => (n < 10 ? "0" + n : "" + n);
/** C# ToString("00.##") : 정수는 두 자리 이상으로 */
const age2 = (n: number) => (n >= 0 && n < 10 ? "0" + n : "" + n);

export function parkJeHwaUi(g: Goong, i: number): string {
  const v = getPakjehwaeui(g.eightmun, i);
  return v === 1 ? "和" : v === 2 ? "義" : v === 3 ? "迫" : v === 4 ? "制" : "";
}

export interface CellView {
  index: number;           // 0~8 (궁번호 - 1)
  isCenter: boolean;
  hasJi: boolean;          // 년월일시 지지가 있는 궁 (회색 배경)
  lines: { text: string; align?: "right" }[];
}

/** 한 궁에 보여줄 8줄 */
export function cellView(r: SajuResult, i: number): CellView {
  const g = r.goong[i];
  const sj = r.sjGanzi;
  const t1 = r.eunboksu1, t2 = r.eunboksu2;

  let l1 = " " + (i + 1) + " (" + toOhaeng_1(getohaeng(i + 1, 3)) + ")";
  let hasJi = false;
  if (i !== 4) {
    (["年支", "月支", "日支", "時支"] as const).forEach((name, k) => {
      if (g.b_dong[k]) { l1 += " " + name; hasJi = true; }
    });
  }
  l1 += toFourgan(i, r.goong, sj) + toCheonMaRok(g.cheoneul, g.cheonma, g.ilrok);

  const l2 = bokgankyuk(i, r.goong, sj) + " " + g.sinsal + " " + g.josang;
  const l3 = toHongNumLvl(g.hongNumlvl[0]);

  const end0 = g.hongNum[0] === 10 ? g.yoo_age[0] + t1 - 1 : g.yoo_age[0] + g.hongNum[0] - 1;
  const l4 = (i === 4 ? setBatangguk1(r.goong) : "") + parkJeHwaUi(g, i) + " " + to8Mun(g.eightmun) + " " + toNum(g.hongNum[0]) + " "
    + toYookSam(g.yooksam[0]) + " " + toGooSung(g.goosung) + " " + g.yoo_age[0] + "~" + end0 + " " + toSixSin(g.six_sin[0]);

  const end1 = g.hongNum[1] === 10 ? g.yoo_age[1] + t2 - 1 : g.yoo_age[1] + g.hongNum[1] - 1;
  const l5 = to8Goe(g.eightgoe) + " " + toNum(g.hongNum[1]) + " " + toYookSam(g.yooksam[1]) + " " + g.eightjang + " "
    + age2(g.yoo_age[1]) + "~" + age2(end1) + " " + toSixSin(g.six_sin[1]);

  const l6 = to8Mun2(g.timeeightmun) + "  " + toHongNumLvl(g.hongNumlvl[1]) + "  " + toTaeulGusung(g.taeulgusung);
  const l7 = g.kyukkuk;
  const l8 = "(" + toMunWang(i) + ") " + g.gongmang + " " + g.eunsung;

  return {
    index: i, isCenter: i === 4, hasJi,
    lines: [{ text: l1 }, { text: l2, align: "right" }, { text: l3 }, { text: l4 }, { text: l5 }, { text: l6 }, { text: l7 }, { text: l8 }],
  };
}

/** "양력 2024년 3월 5일 7:09" / "음력 2024년 02월 05일 07:09" */
export function dateLabel(r: SajuResult, inputWasSolar: boolean, h: number, mi: number): string {
  if (!inputWasSolar) {
    const s = r.solarDt;
    return `양력 ${year(s)}년 ${month(s)}월 ${day(s)}일 ${h}:${p2(mi)}`;
  }
  return `음력 ${r.lunarYear}년 ${p2(r.lunarMonth)}월${r.ly ? "(윤달)" : ""} ${p2(r.lunarDay)}일 ${p2(h)}:${p2(mi)}`;
}

export function realTimeLabel(r: SajuResult): string {
  const t = r.realDt;
  return `${year(t)}-${p2(month(t))}-${p2(day(t))} ${p2(hour(t))}:${p2(minute(t))}`;
}

/** 신수운 폼의 한 칸: 유년 나이 범위 대신 行年宮 표시와 월국 날짜가 들어간다 */
export function cellViewSinsoo(r: SajuResult, i: number, hyear: number, monthMode: boolean): CellView {
  const g = r.goong;
  const base = cellView(r, i);
  const c = g[i];
  const l3 = toHongNumLvl(c.hongNumlvl[0]) + (i === hyear - 1 ? "     行年宮" : "");
  const l4 = (i === 4 ? setBatangguk1(g) : "") + parkJeHwaUi(c, i) + " " + to8Mun(c.eightmun) + " " + toNum(c.hongNum[0]) + " "
    + toYookSam(c.yooksam[0]) + " " + toGooSung(c.goosung) + " " + toSixSin(c.six_sin[0]);
  const l5 = to8Goe(c.eightgoe) + " " + toNum(c.hongNum[1]) + " " + toYookSam(c.yooksam[1]) + " " + c.eightjang + " " + toSixSin(c.six_sin[1]);
  const lines = [base.lines[0], base.lines[1], { text: l3 }, { text: l4 }, { text: l5 }, base.lines[5], base.lines[6], base.lines[7]];
  if (monthMode) {
    lines.push({ text: c.month_days });
    if (c.month_days_1) lines.push({ text: c.month_days_1, align: "right" as const });
  }
  return { ...base, lines };
}
