import { Dt } from "./datetime";

/** 한 개 궁(9궁 중 하나)의 계산 결과. C# Goong 클래스와 같은 필드 */
export interface Goong {
  hongNum: number[];      // 천반수 지반수
  b_dong: boolean[];      // 사지(년월일시 동처)
  b_gan: boolean[];       // 사간
  yoo_age: number[];      // 유년
  six_sin: number[];      // 육신
  hongNumlvl: number[];   // 홍국수 강약
  yooksam: number[];      // 육의삼기 [천반, 지반]
  eightmun: number;       // 팔문
  timeeightmun: number;   // 시가팔문
  eightgoe: number;       // 팔괘
  goosung: number;        // 구성
  eightjang: string;      // 팔장
  cheoneul: number;       // 천을귀인
  cheonma: number;        // 천마
  ilrok: number;          // 일록
  eunsung: string;        // 12운성
  gongmang: string;       // 공망
  sinsal: string;         // 신살
  kyukkuk: string;        // 격국
  taeulgusung: number;    // 태을구성
  josang: string;         // 조객상문
  month_days: string;     // 월국 날짜 (신수운)
  month_days_1: string;   // 월국 날짜 - 네귀퉁이 (신수운)
}

export function newGoong(): Goong {
  return {
    hongNum: [0, 0], b_dong: [false, false, false, false], b_gan: [false, false, false, false],
    yoo_age: [0, 0], six_sin: [0, 0], hongNumlvl: [0, 0], yooksam: [0, 0],
    eightmun: 0, timeeightmun: 0, eightgoe: 0, goosung: 0, eightjang: "",
    cheoneul: 0, cheonma: 0, ilrok: 0, eunsung: "", gongmang: "", sinsal: "", kyukkuk: "",
    taeulgusung: 0, josang: "", month_days: "", month_days_1: "",
  };
}

export interface DaeunItem {
  startAge: number;
  gan: string;
  zi: string;
}

/** 계산 결과 한 벌 (C# SajuResult) */
export interface SajuResult {
  solarDt: Dt;            // 양력 일시 (입력이 음력이면 변환된 값)
  realDt: Dt;             // 서머타임, 동경시 등을 보정한 일시
  lunarValid: boolean;    // 양력으로 입력했을 때만 음력 값이 채워진다
  ly: boolean;            // 윤달 여부
  lunarYear: number;
  lunarMonth: number;
  lunarDay: number;
  terms: Dt[];            // 24절기
  direction: boolean;     // 양둔(true), 음둔(false)
  sjGanzi: number[][];    // 년월일시 간지 [4][2]
  goong: Goong[];         // 9궁
  eunboksu1: number;
  eunboksu2: number;      // 은복수
  sisunsoo: number;       // 시순수
  birthJeolgi: string;    // 생일 절기/상중하원/국 설명
  daeun: DaeunItem[];     // 10년 대운 9칸
}
