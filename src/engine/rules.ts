// 자동 생성: 원본 저장소(ssakarin/saju)의 tools/transpile/gen_rules.py 가 SajuEngine.Core.cs 에서 옮긴 계산 규칙.
// 규칙을 바꿀 때는 C# 쪽을 고친 뒤 다시 생성하거나, 이 파일을 신중히 직접 수정한다.
import { Goong } from "./types";
import { Dt } from "./datetime";
import { getohaeng_dt } from "./calendarRules";

export function toGan(num: number): string
        {
            if (num == 1) return "甲";
            else if (num == 2) return "乙";
            else if (num == 3) return "丙";
            else if (num == 4) return "丁";
            else if (num == 5) return "戊";
            else if (num == 6) return "己";
            else if (num == 7) return "庚";
            else if (num == 8) return "辛";
            else if (num == 9) return "壬";
            else if (num == 10) return "癸";
            else return "";
        }

export function toZi(num: number): string
        {
            if (num == 1) return "子";
            else if (num == 2) return "丑";
            else if (num == 3) return "寅";
            else if (num == 4) return "卯";
            else if (num == 5) return "辰";
            else if (num == 6) return "巳";
            else if (num == 7) return "午";
            else if (num == 8) return "未";
            else if (num == 9) return "申";
            else if (num == 10) return "酉";
            else if (num == 11) return "戌";
            else if (num == 12) return "亥";
            else return "";
        }

export function toNum(num: number): string
        {
            if (num == 1) return "一";
            else if (num == 2) return "二";
            else if (num == 3) return "三";
            else if (num == 4) return "四";
            else if (num == 5) return "五";
            else if (num == 6) return "六";
            else if (num == 7) return "七";
            else if (num == 8) return "八";
            else if (num == 9) return "九";
            else if (num == 10) return "十";
            else return "";
        }

export function toOhaeng(num: number): string
        {
            if (num == 0) return "金";
            else if (num == 1) return "水";
            else if (num == 2) return "木";
            else if (num == 3) return "火";
            else if (num == 4) return "土";
            else return "";
        }

export function toOhaeng_1(num: number): string
        {
            if (num == 0) return "水";
            else if (num == 1) return "木";
            else if (num == 2) return "火";
            else if (num == 3) return "土";
            else if (num == 4) return "金";
            else return "";
        }

export function toSixSin(num: number): string
        {
            if (num == 1) return "世";
            else if (num == 2) return "兄";
            else if (num == 3) return "孫";
            else if (num == 4) return "財";
            else if (num == 5) return "鬼";
            else if (num == 6) return "官";
            else if (num == 7) return "父";
            else return "";
        }

export function toHongNumLvl(num: number): string
        {
            if (num == 0) return "XXX";
            else if (num == 1) return "XXO";
            else if (num == 2) return "XOX";
            else if (num == 3) return "XOO";
            else if (num == 4) return "OXX";
            else if (num == 5) return "OXO";
            else if (num == 6) return "OOX";
            else if (num == 7) return "OOO";
            else return "";
        }

export function toYookSam(num: number): string
        {
            if (num == 0) return "戊";
            else if (num == 1) return "己";
            else if (num == 2) return "庚";
            else if (num == 3) return "辛";
            else if (num == 4) return "壬";
            else if (num == 5) return "癸";
            else if (num == 6) return "丁";
            else if (num == 7) return "丙";
            else if (num == 8) return "乙";
            else return " ";
        }

export function toJeolGi(num: number): string
        {
            if (num == 0) return "소한";
            else if (num == 1) return "대한";
            else if (num == 2) return "입춘";
            else if (num == 3) return "우수";
            else if (num == 4) return "경칩";
            else if (num == 5) return "춘분";
            else if (num == 6) return "청명";
            else if (num == 7) return "곡우";
            else if (num == 8) return "입하";
            else if (num == 9) return "소만";
            else if (num == 10) return "망종";
            else if (num == 11) return "하지";
            else if (num == 12) return "소서";
            else if (num == 13) return "대서";
            else if (num == 14) return "입추";
            else if (num == 15) return "처서";
            else if (num == 16) return "백로";
            else if (num == 17) return "추분";
            else if (num == 18) return "한로";
            else if (num == 19) return "상강";
            else if (num == 20) return "입동";
            else if (num == 21) return "소설";
            else if (num == 22) return "대설";
            else if (num == 23) return "동지";
            else return "";
        }

export function to8Mun(num: number): string
        {
            if (num == 0) return "生";
            else if (num == 1) return "傷";
            else if (num == 2) return "杜";
            else if (num == 3) return "景";
            else if (num == 4) return "死";
            else if (num == 5) return "驚";
            else if (num == 6) return "開";
            else if (num == 7) return "休";
            else  return "";
        }

export function to8Mun2(num: number): string
        {
            if (num == 0) return "生門";
            else if (num == 1) return "傷門";
            else if (num == 2) return "杜門";
            else if (num == 3) return "景門";
            else if (num == 4) return "死門";
            else if (num == 5) return "驚門";
            else if (num == 6) return "開門";
            else if (num == 7) return "休門";
            else return "";
        }

export function to8Goe(num: number): string
        {
            if (num == 0) return "氣";
            else if (num == 1) return "宜";
            else if (num == 2) return "體";
            else if (num == 3) return "魂";
            else if (num == 4) return "害";
            else if (num == 5) return "德";
            else if (num == 6) return "命";
            else if (num == 7) return "歸";
            else return "";
        }

export function toMunWang(num: number): string
        {
            if (num == 0) return "坎";
            else if (num == 1) return "坤";
            else if (num == 2) return "震";
            else if (num == 3) return "巽";
            else if (num == 4) return "中";
            else if (num == 5) return "乾";
            else if (num == 6) return "兌";
            else if (num == 7) return "艮";
            else if (num == 8) return "離";
            else return "";
        }

export function toGooSung(num: number): string
        {
            if (num == 0) return "輔";
            else if (num == 1) return "英";
            else if (num == 2) return "芮";
            else if (num == 3) return "柱";
            else if (num == 4) return "心";
            else if (num == 5) return "蓬";
            else if (num == 6) return "任";
            else if (num == 7) return "沖";
            else if (num == 8) return "禽";
            else return "";
        }

export function toCheonMaRok(cheoneul: number, cheonma: number, ilrok: number): string
        {
            let text = " ";
            if (cheoneul == 1) text += "天乙 ";
            else if (cheoneul == 2) text += "伏天乙 ";
            if (cheonma == 1) text += "天馬 ";
            else if (cheonma == 2) text += "伏天馬 ";
            if (ilrok == 1) text += "日祿 ";
            else if (ilrok == 2) text += "伏日祿 ";
            return text;
        }

export function toEunSung(num: number): string
        {
            if (num == 0) return "胞";
            else if (num == 1) return "胎";
            else if (num == 2) return "養";
            else if (num == 3) return "生";
            else if (num == 4) return "浴";
            else if (num == 5) return "帶";
            else if (num == 6) return "祿";
            else if (num == 7) return "旺";
            else if (num == 8) return "衰";
            else if (num == 9) return "病";
            else if (num == 10) return "死";
            else if (num == 11) return "墓";
            else return "";
        }

export function toFourgan(num: number, goong: Goong[], sjGanzi: number[][]): string
        {
            const day = [ [ "子", "戊" ],[ "戌", "己"], [ "申", "庚" ],[ "午", "辛" ],[ "辰", "壬" ],[ "寅", "癸" ] ];
            let cmp = "";
            let temp = "";
            let i = 0, j = 0;

            for (j = 0; j< 4; j ++)
            {
                if (toGan(sjGanzi[j][0]) == "甲")
                {
                    for (i = 0; i < 6; i++)
                    {
                        if (toZi(sjGanzi[j][1]) == day[i][0]) cmp = day[i][1];
                    }
                }
                else cmp = toGan(sjGanzi[j][0]);
                if (j == 0 && toYookSam(goong[num].yooksam[1]) == cmp)
                {
                    temp += " 年干";
                }
                if (j == 1 && toYookSam(goong[num].yooksam[1]) == cmp)
                {
                    temp += " 月干";
                }
                if (j == 2 && toYookSam(goong[num].yooksam[1]) == cmp)
                {
                    temp += " 日干";
                }
                if (j == 3 && toYookSam(goong[num].yooksam[1]) == cmp)
                {
                    temp += " 時干";
                }
            }

            return temp;
        }

export function bokgankyuk(num: number, goong: Goong[], sjGanzi: number[][]): string
        {
            let cmp = "";
            let temp = "";
            cmp = toGan(sjGanzi[2][0]);
            if (toYookSam(goong[num].yooksam[0]) == "庚" && toYookSam(goong[num].yooksam[1]) == "庚") temp = "";
            else if (toYookSam(goong[num].yooksam[1]) == cmp && toYookSam(goong[num].yooksam[0]) == "庚") temp += "伏干格";
            else if (toYookSam(goong[num].yooksam[0]) == cmp && toYookSam(goong[num].yooksam[1]) == "庚") temp += "飛干格";

            return temp;
        }

export function toSaji(b_dong: boolean[], i: number): string
        {
            if (b_dong[0] === true) return "年";
            else if (b_dong[1] === true) return "月";
            else if (b_dong[2] === true) return "日";
            else if (b_dong[3] === true) return "時";
            else if (i == 4) return "中";
            else return "";

        }

export function toTaeulGusung(i: number): string
        {
            if (i == 0) return "太乙";
            else if (i == 1) return "攝提";
            else if (i == 2) return "軒轅";
            else if (i == 3) return "招搖";
            else if (i == 4) return "天符";
            else if (i == 5) return "靑龍";
            else if (i == 6) return "咸池";
            else if (i == 7) return "太陰";
            else if (i == 8) return "天乙";
            else return "에러";
        }

export function getPakjehwaeui(mun: number, goong: number): number
        {
            const eightmun_ohaeng = [ 3, 1, 1, 2, 3, 4, 4, 0, 99 ];
            const goong_ohaeng = [ 0, 3, 1, 1, -99, 4, 4, 3, 2 ];

            if (goong_ohaeng[goong]- eightmun_ohaeng[mun] == 1 || goong_ohaeng[goong] - eightmun_ohaeng[mun] == -4) return 1;
            else if (eightmun_ohaeng[mun] - goong_ohaeng[goong] == 1 || eightmun_ohaeng[mun] - goong_ohaeng[goong] == -4) return 2;
            else if (goong_ohaeng[goong] - eightmun_ohaeng[mun] == 2 || goong_ohaeng[goong] - eightmun_ohaeng[mun] == -3) return 3;
            else if (eightmun_ohaeng[mun] - goong_ohaeng[goong] == 2 || eightmun_ohaeng[mun] - goong_ohaeng[goong] == -3) return 4;
            else return 0;
        }

export function setHongNum(goong: Goong[], sjGanzi: number[][]): { eunboksu1: number; eunboksu2: number }
        {
            let t1 = 0, t2 = 0, eunboksu1 = 0, eunboksu2 = 0;

            t1 = (sjGanzi[0][1] + sjGanzi[1][1] + sjGanzi[2][1] + sjGanzi[3][1]) % 9;
            t2 = (sjGanzi[0][0] + sjGanzi[1][0] + sjGanzi[2][0] + sjGanzi[3][0]) % 9;

            if (t1 == 0) t1 = 9;
            if (t2 == 0) t2 = 9;

            if (t1 == 5)
            {
                goong[8].hongNum[0] = t2 % 10 + 1;

                for (let i = 0; i < 9; i++) goong[i].hongNum[1] = i+1;
                for (let i = 7; i >= 0; i--) goong[i].hongNum[0] = goong[i + 1].hongNum[0] % 10 + 1;

                eunboksu1 = goong[4].hongNum[0];
                eunboksu2 = 5;

                goong[4].hongNum[0] = t2;
            }

            else
            {
                goong[0].hongNum[1] = t1 % 10 + 1;
                goong[8].hongNum[0] = t2 % 10 + 1;

                for (let i = 1; i < 9; i++) goong[i].hongNum[1] = goong[i - 1].hongNum[1] % 10 + 1;
                for (let i = 7; i >= 0; i--) goong[i].hongNum[0] = goong[i + 1].hongNum[0] % 10 + 1;

                eunboksu1 = goong[4].hongNum[0];
                eunboksu2 = goong[4].hongNum[1];
                goong[4].hongNum[1] = t1;
                goong[4].hongNum[0] = t2;
            }
        return { eunboksu1, eunboksu2 };
        }

export function setfourGan(goong: Goong[], sjGanzi: number[][]): void
        {
            const day = [ [ "子", "戊" ], [ "戌", "己" ], [ "申", "庚" ], [ "午", "辛" ], [ "辰", "壬" ], [ "寅", "癸" ] ];
            let cmp = "";
            let i = 0, j = 0, k = 0;

            for(k = 0; k <9; k++)
            {
                for (j = 0; j < 4; j++)
                {
                    if (toGan(sjGanzi[j][0]) == "甲")
                    {
                        for (i = 0; i < 6; i++)
                        {
                            if (toZi(sjGanzi[j][1]) == day[i][0]) cmp = day[i][1];
                        }
                    }
                    else cmp = toGan(sjGanzi[j][0]);
                    if (j == 0 && toYookSam(goong[k].yooksam[1]) == cmp) goong[k].b_gan[0] = true;
                    if (j == 1 && toYookSam(goong[k].yooksam[1]) == cmp) goong[k].b_gan[1] = true;
                    if (j == 2 && toYookSam(goong[k].yooksam[1]) == cmp) goong[k].b_gan[2] = true;
                    if (j == 3 && toYookSam(goong[k].yooksam[1]) == cmp) goong[k].b_gan[3] = true;
                }
            }
        }

export function setDongcheo(goong: Goong[], sjGanzi: number[][]): void
        {
            for (let i = 0; i < 4; i++) { if (sjGanzi[i][1] == 1) goong[0].b_dong[i] = true; }
            for (let i = 0; i < 4; i++) { if (sjGanzi[i][1] == 8 || sjGanzi[i][1] == 9) goong[1].b_dong[i] = true; }
            for (let i = 0; i < 4; i++) { if (sjGanzi[i][1] == 4) goong[2].b_dong[i] = true; }
            for (let i = 0; i < 4; i++) { if (sjGanzi[i][1] == 5 || sjGanzi[i][1] == 6) goong[3].b_dong[i] = true; }
            for (let i = 0; i < 4; i++) { if (sjGanzi[i][1] == 11 || sjGanzi[i][1] == 12) goong[5].b_dong[i] = true; }
            for (let i = 0; i < 4; i++) { if (sjGanzi[i][1] == 10) goong[6].b_dong[i] = true; }
            for (let i = 0; i < 4; i++) { if (sjGanzi[i][1] == 2 || sjGanzi[i][1] == 3) goong[7].b_dong[i] = true; }
            for (let i = 0; i < 4; i++) { if (sjGanzi[i][1] == 7) goong[8].b_dong[i] = true; }
        }

export function setSixSin(goong: Goong[], sjGanzi: number[][]): void
        {
            let i = 0;
            for (i = 0; goong[i].b_dong[2] !== true; i++) ;

            for (let j = 0; j < 9; j++)
            {
                for (let k = 0; k < 2; k++)
                {
                    if (goong[i].hongNum[1] == 1 || goong[i].hongNum[1] == 6)
                    {
                        if (goong[(i + j) % 9].hongNum[k] == 1 || goong[(i + j) % 9].hongNum[k] == 6) goong[(i + j) % 9].six_sin[k] = 2;
                        else if (goong[(i + j) % 9].hongNum[k] == 3 || goong[(i + j) % 9].hongNum[k] == 8) goong[(i + j) % 9].six_sin[k] = 3;
                        else if (goong[(i + j) % 9].hongNum[k] == 2 || goong[(i + j) % 9].hongNum[k] == 7) goong[(i + j) % 9].six_sin[k] = 4;
                        else if ((goong[i].hongNum[1] == 1 && goong[(i + j) % 9].hongNum[k] == 5) || (goong[i].hongNum[1] == 6 && goong[(i + j) % 9].hongNum[k] == 10)) goong[(i + j) % 9].six_sin[k] = 5;
                        else if ((goong[i].hongNum[1] == 1 && goong[(i + j) % 9].hongNum[k] == 10) || (goong[i].hongNum[1] == 6 && goong[(i + j) % 9].hongNum[k] == 5)) goong[(i + j) % 9].six_sin[k] = 6;
                        else goong[(i + j) % 9].six_sin[k] = 7;
                    }
                    else if (goong[i].hongNum[1] == 3 || goong[i].hongNum[1] == 8)
                    {
                        if (goong[(i + j) % 9].hongNum[k] == 3 || goong[(i + j) % 9].hongNum[k] == 8) goong[(i + j) % 9].six_sin[k] = 2;
                        else if (goong[(i + j) % 9].hongNum[k] == 2 || goong[(i + j) % 9].hongNum[k] == 7) goong[(i + j) % 9].six_sin[k] = 3;
                        else if (goong[(i + j) % 9].hongNum[k] == 5 || goong[(i + j) % 9].hongNum[k] == 10) goong[(i + j) % 9].six_sin[k] = 4;
                        else if ((goong[i].hongNum[1] == 3 && goong[(i + j) % 9].hongNum[k] == 4) || (goong[i].hongNum[1] == 8 && goong[(i + j) % 9].hongNum[k] == 9)) goong[(i + j) % 9].six_sin[k] = 6;
                        else if ((goong[i].hongNum[1] == 3 && goong[(i + j) % 9].hongNum[k] == 9) || (goong[i].hongNum[1] == 8 && goong[(i + j) % 9].hongNum[k] == 4)) goong[(i + j) % 9].six_sin[k] = 5;
                        else goong[(i + j) % 9].six_sin[k] = 7;
                    }
                    else if (goong[i].hongNum[1] == 2 || goong[i].hongNum[1] == 7)
                    {
                        if (goong[(i + j) % 9].hongNum[k] == 2 || goong[(i + j) % 9].hongNum[k] == 7) goong[(i + j) % 9].six_sin[k] = 2;
                        else if (goong[(i + j) % 9].hongNum[k] == 5 || goong[(i + j) % 9].hongNum[k] == 10) goong[(i + j) % 9].six_sin[k] = 3;
                        else if (goong[(i + j) % 9].hongNum[k] == 4 || goong[(i + j) % 9].hongNum[k] == 9) goong[(i + j) % 9].six_sin[k] = 4;
                        else if ((goong[i].hongNum[1] == 2 && goong[(i + j) % 9].hongNum[k] == 1) || (goong[i].hongNum[1] == 7 && goong[(i + j) % 9].hongNum[k] == 6)) goong[(i + j) % 9].six_sin[k] = 6;
                        else if ((goong[i].hongNum[1] == 2 && goong[(i + j) % 9].hongNum[k] == 6) || (goong[i].hongNum[1] == 7 && goong[(i + j) % 9].hongNum[k] == 1)) goong[(i + j) % 9].six_sin[k] = 5;
                        else goong[(i + j) % 9].six_sin[k] = 7;
                    }
                    else if (goong[i].hongNum[1] == 5 || goong[i].hongNum[1] == 10)
                    {
                        if (goong[(i + j) % 9].hongNum[k] == 5 || goong[(i + j) % 9].hongNum[k] == 10) goong[(i + j) % 9].six_sin[k] = 2;
                        else if (goong[(i + j) % 9].hongNum[k] == 4 || goong[(i + j) % 9].hongNum[k] == 9) goong[(i + j) % 9].six_sin[k] = 3;
                        else if (goong[(i + j) % 9].hongNum[k] == 1 || goong[(i + j) % 9].hongNum[k] == 6) goong[(i + j) % 9].six_sin[k] = 4;
                        else if ((goong[i].hongNum[1] == 5 && goong[(i + j) % 9].hongNum[k] == 3) || (goong[i].hongNum[1] == 10 && goong[(i + j) % 9].hongNum[k] == 8)) goong[(i + j) % 9].six_sin[k] = 5;
                        else if ((goong[i].hongNum[1] == 5 && goong[(i + j) % 9].hongNum[k] == 8) || (goong[i].hongNum[1] == 10 && goong[(i + j) % 9].hongNum[k] == 3)) goong[(i + j) % 9].six_sin[k] = 6;
                        else goong[(i + j) % 9].six_sin[k] = 7;
                    }
                    else
                    {
                        if (goong[(i + j) % 9].hongNum[k] == 4 || goong[(i + j) % 9].hongNum[k] == 9) goong[(i + j) % 9].six_sin[k] = 2;
                        else if (goong[(i + j) % 9].hongNum[k] == 1 || goong[(i + j) % 9].hongNum[k] == 6) goong[(i + j) % 9].six_sin[k] = 3;
                        else if (goong[(i + j) % 9].hongNum[k] == 3 || goong[(i + j) % 9].hongNum[k] == 8) goong[(i + j) % 9].six_sin[k] = 4;
                        else if ((goong[i].hongNum[1] == 4 && goong[(i + j) % 9].hongNum[k] == 2) || (goong[i].hongNum[1] == 9 && goong[(i + j) % 9].hongNum[k] == 7)) goong[(i + j) % 9].six_sin[k] = 5;
                        else if ((goong[i].hongNum[1] == 4 && goong[(i + j) % 9].hongNum[k] == 7) || (goong[i].hongNum[1] == 9 && goong[(i + j) % 9].hongNum[k] == 2)) goong[(i + j) % 9].six_sin[k] = 6;
                        else goong[(i + j) % 9].six_sin[k] = 7;
                    }

                }
            }
            goong[i].six_sin[1] = 1;
        }

export function setHonglvl(goong: Goong[], month: number, dt: Dt): void
        {
            for (let i=0; i<9; i++)
            {
                {
                    const temp = [ 0, 0, 0 ];
                    if (getohaeng(goong[i].hongNum[1], 0) == getohaeng(i+1, 3) || getohaeng(goong[i].hongNum[1], 0) == (getohaeng(i+1, 3) + 1) % 5)
                        temp[0] = 1;
                    if (getohaeng(goong[i].hongNum[1], 0) == getohaeng(goong[i].hongNum[0], 0) || getohaeng(goong[i].hongNum[1], 0) == (getohaeng(goong[i].hongNum[0], 0) + 1) % 5)
                        temp[1] = 1;


                    if (getohaeng(goong[i].hongNum[1], 0) == getohaeng_dt(dt) || getohaeng(goong[i].hongNum[1], 0) == (getohaeng_dt(dt) + 1) % 5)
                        temp[2] = 1;
                    goong[i].hongNumlvl[1] = 4 * temp[0] + 2 * temp[1] + temp[2];

                    temp[0] = temp[1] = temp[2] = 0;
                    if (getohaeng(goong[i].hongNum[0], 0) == getohaeng(i + 1, 3) || getohaeng(goong[i].hongNum[0], 0) == (getohaeng(i + 1, 3) + 1) % 5)
                        temp[0] = 1;
                    if (getohaeng(goong[i].hongNum[0], 0) == getohaeng(goong[i].hongNum[1], 0) || getohaeng(goong[i].hongNum[0], 0) == (getohaeng(goong[i].hongNum[1], 0) + 1) % 5)
                        temp[1] = 1;

                    if (getohaeng(goong[i].hongNum[0], 0) == getohaeng_dt(dt) || getohaeng(goong[i].hongNum[0], 0) == (getohaeng_dt(dt) + 1) % 5)
                        temp[2] = 1;
                    goong[i].hongNumlvl[0] = 4 * temp[0] + 2 * temp[1] + temp[2];
                }
            }
        }

export function getohaeng(num: number, type: number): number
        {




            let ohaeng = 0;
            if (type == 0)
            {
                if (num == 1 || num == 6) ohaeng = 0;
                else if (num == 3 || num == 8) ohaeng = 1;
                else if (num == 2 || num == 7) ohaeng = 2;
                else if (num == 5 || num == 10) ohaeng = 3;
                else ohaeng = 4;
            }
            else if (type == 1)
            {
                if (num == 1 || num == 2) ohaeng = 1;
                else if (num == 3 || num == 4) ohaeng = 2;
                else if (num == 5 || num == 6) ohaeng = 3;
                else if (num == 7 || num == 8) ohaeng = 4;
                else ohaeng = 0;
            }
            else if (type == 2)
            {
                if (num == 1 || num == 12) ohaeng = 0;
                else if (num == 3 || num == 4) ohaeng = 1;
                else if (num == 6 || num == 7) ohaeng = 2;
                else if (num == 2 || num == 5 || num == 8 || num == 11) ohaeng = 3;
                else ohaeng = 4;
            }
            else
            {
                if (num == 1 || num == 6) ohaeng = 0;
                else if (num == 3 || num == 8) ohaeng = 1;
                else if (num == 4 || num == 9) ohaeng = 2;
                else if (num == 5) ohaeng = 3;
                else ohaeng = 4;
            }
            return ohaeng;
        }

export function setYooAge(goong: Goong[], t1: number, t2: number): void
        {
            let i = 0;

            for (i = 0; goong[i].b_dong[2] !== true; i++) ;
            goong[i].yoo_age[1] = 1;

            for (let j = 1; j < 9; j++)
            {
                if (goong[(j + i - 1) % 9].hongNum[1] == 10) goong[(j + i) % 9].yoo_age[1] = t2 + goong[(j + i - 1) % 9].yoo_age[1];
                else goong[(j + i) % 9].yoo_age[1] = goong[(j + i - 1) % 9].hongNum[1] + goong[(j + i - 1) % 9].yoo_age[1];
            }
            if (goong[(i + 8) % 9].hongNum[1] == 10) goong[i].yoo_age[0] = goong[(i + 8) % 9].yoo_age[1] + t2;
            else
                goong[i].yoo_age[0] = goong[(i+8)%9].yoo_age[1]+ goong[(i + 8) % 9].hongNum[1];
            for (let j = 1; j < 9; j++)
            {
                if (goong[(i-j+10) % 9].hongNum[0] == 10) goong[(i-j+9) % 9].yoo_age[0] = t1 + goong[(i-j+10) % 9].yoo_age[0];
                else goong[(i-j+9) % 9].yoo_age[0] = goong[(i-j+10) % 9].hongNum[0] + goong[(i-j+10) % 9].yoo_age[0];
            }
        }

export function set8mun(goong: Goong[], sjGanzi: number[][], direction: boolean): void
        {
            const day = [ [ "甲子", "乙丑", "丙寅", "丁卯", "戊辰", "己巳", "庚午", "辛未", "壬申", "癸酉","甲戌", "乙亥"],
                            [ "丙子", "丁丑", "戊寅", "己卯", "庚辰", "辛巳", "壬午", "癸未", "甲申", "乙酉", "丙戌", "丁亥"],
                            [ "戊子", "己丑", "庚寅", "辛卯", "壬辰", "癸巳", "甲午", "乙未", "丙申", "丁酉", "戊戌", "己亥"],
                            [ "庚子", "辛丑", "壬寅", "癸卯", "甲辰", "乙巳", "丙午", "丁未", "戊申", "己酉", "庚戌", "辛亥"],
                            [ "壬子", "癸丑", "甲寅", "乙卯", "丙辰", "丁巳", "戊午", "己未", "庚申", "辛酉", "壬戌", "癸亥"]];
            const foward_direction = [ 8, 7, 4, 9, 1, 6, 3, 2 ];
            const backward_direction = [ 8, 2, 3, 6, 1, 9, 4, 7 ];

            let i = 0, j=0 , k=0 ;
            let temp = toGan(sjGanzi[2][0]) + toZi(sjGanzi[2][1]);


            EXIT_FOR: for (i = 0; i < 5; i++)
        for (j = 0; j < 12; j++) {
            if (day[i][j] == temp) break EXIT_FOR;
        }

            if (i == 1 || i == 3) j += 12;

            for(k=0; k< 8; k++)
            {
                if (direction)
                {
                    goong[foward_direction[(Math.trunc(j / 3) + k)%8]-1].eightmun = k;
                }
                else
                {
                    goong[backward_direction[(Math.trunc(j / 3)+k)%8]-1].eightmun = k;
                }
            }
            goong[4].eightmun = 8;
        }

export function settime8mun(goong: Goong[], sjGanzi: number[][], direction: boolean): void
        {
            const day = [ [ "甲子", "乙丑", "丙寅", "丁卯", "戊辰", "己巳", "庚午", "辛未", "壬申", "癸酉","甲戌", "乙亥"],
                            [ "丙子", "丁丑", "戊寅", "己卯", "庚辰", "辛巳", "壬午", "癸未", "甲申", "乙酉", "丙戌", "丁亥"],
                            [ "戊子", "己丑", "庚寅", "辛卯", "壬辰", "癸巳", "甲午", "乙未", "丙申", "丁酉", "戊戌", "己亥"],
                            [ "庚子", "辛丑", "壬寅", "癸卯", "甲辰", "乙巳", "丙午", "丁未", "戊申", "己酉", "庚戌", "辛亥"],
                            [ "壬子", "癸丑", "甲寅", "乙卯", "丙辰", "丁巳", "戊午", "己未", "庚申", "辛酉", "壬戌", "癸亥"]];
            const foward_direction = [ 8, 7, 4, 9, 1, 6, 3, 2 ];
            const backward_direction = [ 8, 2, 3, 6, 1, 9, 4, 7 ];

            let i = 0, j = 0, k = 0;
            let temp = toGan(sjGanzi[3][0]) + toZi(sjGanzi[3][1]);


            EXIT_FOR: for (i = 0; i < 5; i++)
        for (j = 0; j < 12; j++) {
            if (day[i][j] == temp) break EXIT_FOR;
        }

            if (i == 1 || i == 3) j += 4;

            for (k = 0; k < 8; k++)
            {
                if (direction)
                {
                    goong[foward_direction[(j + k) % 8] - 1].timeeightmun = k;
                }
                else
                {
                    goong[backward_direction[(j + k) % 8] - 1].timeeightmun = k;
                }
            }
            goong[4].timeeightmun = 8;
        }

export function set8goe(goong: Goong[]): void
        {
            const goe = [ [ 0, 1, 0 ], [ 0, 0, 0 ], [ 0, 0, 1 ], [ 1, 1, 0 ], [ 1, 1, 0 ], [ 1, 1, 1 ], [ 0, 1, 1 ], [ 1, 0, 0 ], [ 1, 0, 1 ] ];
            const temp: number[] = [0, 0, 0];
            let index = 0;
            let i = 0, j = 0;
            let direction = false;

            for (i = 0; i < 3; i++)
                temp[i] = goe[goong[4].hongNum[1] - 1][i];


            for(i = 0; i< 8; i++)
            {
                if (temp[index] == 0) temp[index] = 1;
                else temp[index] = 0;

                if (index == 2)
                {
                    direction = true;
                    index -= 1;
                }
                else if (!direction) index += 1;

                else if (index == 0)
                {
                    direction = false;
                    index += 1;
                }
                else if (direction) index -= 1;

                for (j = 0; j < 9; j++)
                {
                    if (goe[j][0] == temp[0] && goe[j][1] == temp[1] && goe[j][2] == temp[2])
                    {
                        goong[j].eightgoe = i;

                    }
                }

            }

            goong[4].eightgoe = 10;
        }

export function setGooSung(goong: Goong[], sjGanzi: number[][], sisunsoo: number): void
        {
            const rr = [ 4, 9, 2, 7, 6, 1, 8, 3 ];
            let temp = toGan(sjGanzi[3][0]) + toZi(sjGanzi[3][1]);
            let i = 0, j = 0, k = 0, l = 0, m = 0;
            let yooksam_temp = -1;
            let c = 0;


            for (i = 0; i < 9 && goong[i].yooksam[1] != sisunsoo; i++) ;
            for (j = 0; j < 9 && goong[j].yooksam[0] != sisunsoo; j++) ;





            if (i == 4)
            {
                i = 1;
                c = 1;
            }


            else if (toYookSam(goong[4].yooksam[1]) == toGan(sjGanzi[3][0]))
            {
                yooksam_temp = goong[1].yooksam[1];
                c = 2;
            }

            for (k = 0; k < 8 && rr[k] != i+1; k++) ;
            for (l = 0; l < 8 && rr[l] != j+1; l++) ;

            if (c == 0)
            {
                for (m = 0; m < 8; m++)
                    goong[rr[(m + l - k + 8) % 8] - 1].goosung = m;
                goong[4].goosung = 8;
            }

            else if (c == 1)
            {
                for (m = 0; m < 8; m++)
                {
                    if (m==2)
                        goong[rr[(m + l - k + 8) % 8] - 1].goosung = 8;
                    else
                        goong[rr[(m + l - k + 8) % 8] - 1].goosung = m;
                    goong[4].goosung = 2;
                }
            }
            else
            {
                for (m = 0; m < 8; m++)
                {
                    if (goong[rr[(m + l - k + 8) % 8] - 1].yooksam[0] == yooksam_temp)
                    {
                        goong[rr[(m + l - k + 8) % 8] - 1].goosung = 8;
                        goong[4].goosung = m;
                    }
                    else
                    {
                        goong[rr[(m + l - k + 8) % 8] - 1].goosung = m;
                    }
                }
            }
        }

export function setEightjang(goong: Goong[], sjGanzi: number[][], direction: boolean, sisunsoo: number): void
        {
            const eightjang1 = [ "直", "蛇", "陰", "合", "陳", "雀", "地", "天" ];
            const eightjang2 = [ "直", "蛇", "陰", "合", "虎", "武", "地", "天" ];
            const rr = [ 4, 9, 2, 7, 6, 1, 8, 3 ];
            let i = 0, j = 0;



            if ( sjGanzi[3][0] == 1)
                for (i = 0; i < 9 && goong[i].yooksam[1] != sisunsoo; i++);

            else
                for (i = 0; i < 9 && toYookSam(goong[i].yooksam[1]) != toGan(sjGanzi[3][0]); i++) ;



            if (i == 4) i = 1;

            for (j = 0; j < 8 && rr[j]-1 != i; j++) ;

            if (direction)
            {
                for (i = 0; i < 8; i++)
                    goong[rr[(i+j)%8]-1].eightjang = eightjang1[i];
            }
            else
            {
                for (i = 0; i < 8; i++)
                    goong[rr[(8 - i + j)%8] - 1].eightjang = eightjang2[i];
            }
            goong[4].eightjang = " ";
        }

export function setCheonMaRok(goong: Goong[], sjGanzi: number[][], direction: boolean): void
        {
            const yang = [ 10, 9, 4, 6, 10, 1, 10, 3, 8, 2 ];
            const eum = [ 10, 1, 6, 4, 10, 9, 10, 7, 2, 8 ];
            const chma = [ 3, 5, 7, 9, 5, 1, 3, 5, 7, 9, 5, 1];
            const il = [ 3, 8, 2, 7, 2, 7, 9, 4, 6, 1 ];
            let cheoneol = 0;

            if (direction)
                cheoneol = yang[sjGanzi[2][0] - 1];

            else
                cheoneol = eum[sjGanzi[2][0]-1];

            for (let i = 0; i < 9; i++)
            {
                if (goong[i].hongNum[1] == cheoneol)
                {
                    if (sjGanzi[2][0] == 5 || sjGanzi[2][0] == 7 || sjGanzi[2][0] == 1)
                    {
                        if ((sjGanzi[2][0] == 5 || sjGanzi[2][0] == 7) && ((direction && sjGanzi[0][0] % 2 == 1) || (!direction && sjGanzi[0][0] % 2 == 0)))
                            goong[i].cheoneul = 1;
                        else if (sjGanzi[2][0] == 1 && ((!direction && sjGanzi[0][0] % 2 == 1) || (direction && sjGanzi[0][0] % 2 == 0)))
                            goong[i].cheoneul = 1;
                    }
                    else goong[i].cheoneul = 1;

                }

                else if (i == 4 && (goong[i].hongNum[1] + 5) % 10 == cheoneol)
                {
                    if (sjGanzi[2][0] == 5 || sjGanzi[2][0] == 7 || sjGanzi[2][0] == 2)
                    {
                        if ((sjGanzi[2][0] == 5 || sjGanzi[2][0] == 7) && ((direction && sjGanzi[0][0] % 2 == 1) || (!direction && sjGanzi[0][0] % 2 == 0)))
                            goong[i].cheoneul = 2;
                        else if (sjGanzi[2][0] == 2 && ((!direction && sjGanzi[0][0] % 2 == 1) || (direction && sjGanzi[0][0] % 2 == 0)))
                            goong[i].cheoneul = 2;
                    }
                    else goong[i].cheoneul = 2;

                }
            }

            for (let i = 0; i < 9; i++)
            {
                if (goong[i].hongNum[1] == chma[sjGanzi[1][1] - 1])
                    goong[i].cheonma = 1;

                else if (i == 4 && (goong[i].hongNum[1] + 5) % 10 == chma[sjGanzi[1][1] - 1])
                    goong[i].cheonma = 2;
            }

            for (let i = 0; i < 9; i++)
            {
                if (goong[i].hongNum[1] == il[sjGanzi[2][0] - 1])
                    goong[i].ilrok = 1;

                else if (i == 4 && (goong[i].hongNum[1] + 5) % 10 == il[sjGanzi[2][0] - 1])
                    goong[i].ilrok = 2;
            }
        }

export function swapstring(str: string): string
        {
            let temp = str;
            return temp.substring(1, 2) + temp.substring(0, 1);
        }

export function setEunsung(goong: Goong[], sjGanzi: number[][]): void
        {
            let i = 0, j = 0;
            const gipyo1 = [ 1, 6, 7, 2, 5, 10, 3, 8, 9, 4 ];
            const gipyo2 = [ 6, 7, 12, 1, 12, 1, 9, 10, 3, 4 ];


            const rr = [ 1, 8, 8, 3, 4, 4, 9, 2, 2, 7, 6, 6 ];

            for (i = 0; i < 9 && goong[i].b_dong[2] !== true; i++);
            for (j = 0; j < 10 && goong[i].hongNum[1] != gipyo1[j]; j++) ;

            let start = gipyo2[j];

            for (i = 0; i< 12; i++)
            {
                if (j % 2 == 0)
                {
                    goong[rr[(i + start + 11) % 12] - 1].eunsung += toEunSung(i);
                }
                else
                {
                    goong[rr[((-i + start + 11) % 12)] - 1].eunsung += toEunSung(i);
                }

            }
            if (j % 2 == 0)
            {
                if (start== 3)
                {
                    goong[5].eunsung = swapstring(goong[5].eunsung);
                }
                else if (start == 6)
                {
                    goong[3].eunsung = swapstring(goong[3].eunsung);
                    goong[5].eunsung = swapstring(goong[5].eunsung);
                    goong[7].eunsung = swapstring(goong[7].eunsung);
                }

                else if (start == 9)
                {
                    goong[1].eunsung = swapstring(goong[1].eunsung);
                    goong[5].eunsung = swapstring(goong[5].eunsung);
                    goong[7].eunsung = swapstring(goong[7].eunsung);
                }
                else if (start == 12)
                {
                    goong[7].eunsung = swapstring(goong[7].eunsung);
                }
                else
                {
                    goong[5].eunsung = swapstring(goong[5].eunsung);
                    goong[7].eunsung = swapstring(goong[7].eunsung);
                }
            }
            else
            {
                if (start == 2)
                {
                    goong[1].eunsung = swapstring(goong[1].eunsung);
                    goong[3].eunsung = swapstring(goong[3].eunsung);
                    goong[7].eunsung = swapstring(goong[7].eunsung);
                }
                else if (start == 6)
                {
                    goong[1].eunsung = swapstring(goong[1].eunsung);
                }

                else if (start == 9)
                {
                    goong[3].eunsung = swapstring(goong[3].eunsung);
                }
                else if (start == 11)
                {
                    goong[5].eunsung = swapstring(goong[5].eunsung);
                    goong[1].eunsung = swapstring(goong[1].eunsung);
                    goong[3].eunsung = swapstring(goong[3].eunsung);
                }
                else
                {
                    goong[1].eunsung = swapstring(goong[1].eunsung);
                    goong[3].eunsung = swapstring(goong[3].eunsung);
                }
            }

        }

export function setGongMang(goong: Goong[], sjGanzi: number[][]): void
        {
            let i = 0, j = 0;
            i = sjGanzi[2][1];
            j = sjGanzi[2][0];

            if (i - j == 0)
                goong[5].gongmang = "◯";
            else if ((i - j+12)%12 == 10)
            {
                goong[1].gongmang = "◯";
                goong[6].gongmang = "◯";
            }
            else if ((i - j + 12) % 12 == 8)
            {
                goong[1].gongmang = "◯";
                goong[8].gongmang = "◯";
            }
            else if ((i - j + 12) % 12 == 6)
            {
                goong[3].gongmang = "◯";
            }
            else if ((i - j + 12) % 12 == 4)
            {
                goong[2].gongmang = "◯";
                goong[7].gongmang = "◯";
            }
            else if ((i - j + 12) % 12 == 2)
            {
                goong[0].gongmang = "◯";
                goong[7].gongmang = "◯";
            }
            if (goong[goong[4].hongNum[1] - 1].gongmang == "◯") goong[goong[4].hongNum[1] - 1].gongmang = "◎";
        }

export function setSinsal(goong: Goong[], sjGanzi: number[][]): void
        {
            const samhab = [ [ 11, 3, 7 ],[ 2, 6, 10 ], [ 5, 9, 1 ], [ 8, 0, 4 ]  ];
            const rr = [ 0, 7, 7, 2, 3, 3, 8, 1, 1, 6, 5, 5 ];
            const hong = [ 1, 99, 3, 8, 99, 2, 7, 99, 9, 4, 99, 6 ];
            let i = 0, j = 0;

            EXIT1: for (i = 0; i < 4; i++)
        for (j = 0; j < 3; j++)
            if (samhab[i][j] == sjGanzi[0][1] - 1) break EXIT1;
            for (j = 0; j < 9; j ++)
            {
                if (goong[j].hongNum[1] == hong[(samhab[i][0] + 6) % 12]) goong[j].sinsal += " 歲馬";
                if (goong[j].hongNum[1] == hong[(samhab[i][1] + 11) % 12]) goong[j].sinsal += " 歲亡";
                if (goong[j].hongNum[1] == hong[(samhab[i][2] + 1) % 12]) goong[j].sinsal += " 歲劫";
            }
            goong[rr[(samhab[i][0] + 1) % 12]].sinsal += " 歲年";
            goong[rr[(samhab[i][2]) % 12]].sinsal += " 歲華";

            EXIT2: for (i = 0; i < 4; i++)
        for (j = 0; j < 3; j++)
            if (samhab[i][j] == sjGanzi[2][1] - 1) break EXIT2;
            for (j = 0; j < 9; j++)
            {
                if (goong[j].hongNum[1] == hong[(samhab[i][0] + 6) % 12]) goong[j].sinsal += " 日馬";
                if (goong[j].hongNum[1] == hong[(samhab[i][1] + 11) % 12]) goong[j].sinsal += " 日亡";
                if (goong[j].hongNum[1] == hong[(samhab[i][2] + 1) % 12]) goong[j].sinsal += " 日劫";
            }
            goong[rr[(samhab[i][0] + 1) % 12]].sinsal += " 日年";
            goong[rr[(samhab[i][2]) % 12]].sinsal += " 日華";
        }

export function setKyukkuk(goong: Goong[], sjGanzi: number[][]): void
        {
            let i = 0;
            for(i = 0; i < 9; i++)
            {
                if(i !=4)
                {



                    if (goong[i].yooksam[0] == 0 && goong[i].yooksam[1] == 8) goong[i].kyukkuk += "靑龍合靈";
                    else if (goong[i].yooksam[0] == 0 && goong[i].yooksam[1] == 7) goong[i].kyukkuk += "靑龍回首";
                    else if (goong[i].yooksam[0] == 0 && goong[i].yooksam[1] == 6) goong[i].kyukkuk += "靑龍耀明";
                    else if (goong[i].yooksam[0] == 0 && goong[i].yooksam[1] == 0) goong[i].kyukkuk += "伏吟峻山";
                    else if (goong[i].yooksam[0] == 0 && goong[i].yooksam[1] == 1) goong[i].kyukkuk += "貴人入獄";
                    else if (goong[i].yooksam[0] == 0 && goong[i].yooksam[1] == 2) goong[i].kyukkuk += "直符飛宮";
                    else if (goong[i].yooksam[0] == 0 && goong[i].yooksam[1] == 3) goong[i].kyukkuk += "靑龍折足";
                    else if (goong[i].yooksam[0] == 0 && goong[i].yooksam[1] == 4) goong[i].kyukkuk += "山明水秀";
                    else if (goong[i].yooksam[0] == 0 && goong[i].yooksam[1] == 5) goong[i].kyukkuk += "岩石浸蝕";

                    else if (goong[i].yooksam[0] == 8 && goong[i].yooksam[1] == 8) goong[i].kyukkuk += "伏吟雜草";
                    else if (goong[i].yooksam[0] == 8 && goong[i].yooksam[1] == 7) goong[i].kyukkuk += "三奇順遂";
                    else if (goong[i].yooksam[0] == 8 && goong[i].yooksam[1] == 6) goong[i].kyukkuk += "三奇相佐";
                    else if (goong[i].yooksam[0] == 8 && goong[i].yooksam[1] == 0) goong[i].kyukkuk += "鮮花名甁";
                    else if (goong[i].yooksam[0] == 8 && goong[i].yooksam[1] == 1) goong[i].kyukkuk += "三奇得使 以一當十";
                    else if (goong[i].yooksam[0] == 8 && goong[i].yooksam[1] == 2) goong[i].kyukkuk += "夫妻懷私";
                    else if (goong[i].yooksam[0] == 8 && goong[i].yooksam[1] == 3) goong[i].kyukkuk += "靑龍逃走";
                    else if (goong[i].yooksam[0] == 8 && goong[i].yooksam[1] == 4) goong[i].kyukkuk += "荷葉蓮花";
                    else if (goong[i].yooksam[0] == 8 && goong[i].yooksam[1] == 5) goong[i].kyukkuk += "祿野朝露";

                    else if (goong[i].yooksam[0] == 7 && goong[i].yooksam[1] == 8) goong[i].kyukkuk += "日月並行";
                    else if (goong[i].yooksam[0] == 7 && goong[i].yooksam[1] == 7) goong[i].kyukkuk += "有勇無謨";
                    else if (goong[i].yooksam[0] == 7 && goong[i].yooksam[1] == 6) goong[i].kyukkuk += "三奇順遂";
                    else if (goong[i].yooksam[0] == 7 && goong[i].yooksam[1] == 0) goong[i].kyukkuk += "三奇得使 飛鳥跌穴";
                    else if (goong[i].yooksam[0] == 7 && goong[i].yooksam[1] == 1) goong[i].kyukkuk += "大地普照";
                    else if (goong[i].yooksam[0] == 7 && goong[i].yooksam[1] == 2) goong[i].kyukkuk += "滎入太白";
                    else if (goong[i].yooksam[0] == 7 && goong[i].yooksam[1] == 3) goong[i].kyukkuk += "謨事就成";
                    else if (goong[i].yooksam[0] == 7 && goong[i].yooksam[1] == 4) goong[i].kyukkuk += "是非頗多";
                    else if (goong[i].yooksam[0] == 7 && goong[i].yooksam[1] == 5) goong[i].kyukkuk += "黑雲遮日";

                    else if (goong[i].yooksam[0] == 6 && goong[i].yooksam[1] == 8) goong[i].kyukkuk += "燒田種作";
                    else if (goong[i].yooksam[0] == 6 && goong[i].yooksam[1] == 7) goong[i].kyukkuk += "星隨月轉";
                    else if (goong[i].yooksam[0] == 6 && goong[i].yooksam[1] == 6) goong[i].kyukkuk += "兩火成炎";
                    else if (goong[i].yooksam[0] == 6 && goong[i].yooksam[1] == 0) goong[i].kyukkuk += "有爐有火";
                    else if (goong[i].yooksam[0] == 6 && goong[i].yooksam[1] == 1) goong[i].kyukkuk += "火入句陳";
                    else if (goong[i].yooksam[0] == 6 && goong[i].yooksam[1] == 2) goong[i].kyukkuk += "火煉眞金";
                    else if (goong[i].yooksam[0] == 6 && goong[i].yooksam[1] == 3) goong[i].kyukkuk += "朱雀入獄";
                    else if (goong[i].yooksam[0] == 6 && goong[i].yooksam[1] == 4) goong[i].kyukkuk += "三奇得使 五神互合";
                    else if (goong[i].yooksam[0] == 6 && goong[i].yooksam[1] == 5) goong[i].kyukkuk += "朱雀投江";

                    else if (goong[i].yooksam[0] == 1 && goong[i].yooksam[1] == 8) goong[i].kyukkuk += "柔情密意";
                    else if (goong[i].yooksam[0] == 1 && goong[i].yooksam[1] == 7) goong[i].kyukkuk += "火孛地戶";
                    else if (goong[i].yooksam[0] == 1 && goong[i].yooksam[1] == 6) goong[i].kyukkuk += "朱雀入墓";
                    else if (goong[i].yooksam[0] == 1 && goong[i].yooksam[1] == 0) goong[i].kyukkuk += "犬遇靑龍";
                    else if (goong[i].yooksam[0] == 1 && goong[i].yooksam[1] == 1) goong[i].kyukkuk += "百事不遂";
                    else if (goong[i].yooksam[0] == 1 && goong[i].yooksam[1] == 2) goong[i].kyukkuk += "活鬼廛身";
                    else if (goong[i].yooksam[0] == 1 && goong[i].yooksam[1] == 3) goong[i].kyukkuk += "濕泥汚玉";
                    else if (goong[i].yooksam[0] == 1 && goong[i].yooksam[1] == 4) goong[i].kyukkuk += "反吟濁水";
                    else if (goong[i].yooksam[0] == 1 && goong[i].yooksam[1] == 5) goong[i].kyukkuk += "好事必止";

                    else if (goong[i].yooksam[0] == 2 && goong[i].yooksam[1] == 8) goong[i].kyukkuk += "太白逢星";
                    else if (goong[i].yooksam[0] == 2 && goong[i].yooksam[1] == 7) goong[i].kyukkuk += "太白入熒";
                    else if (goong[i].yooksam[0] == 2 && goong[i].yooksam[1] == 6) goong[i].kyukkuk += "亨亨之格";
                    else if (goong[i].yooksam[0] == 2 && goong[i].yooksam[1] == 0) goong[i].kyukkuk += "有爐無火";
                    else if (goong[i].yooksam[0] == 2 && goong[i].yooksam[1] == 1) goong[i].kyukkuk += "刑格";
                    else if (goong[i].yooksam[0] == 2 && goong[i].yooksam[1] == 2) goong[i].kyukkuk += "戰格";
                    else if (goong[i].yooksam[0] == 2 && goong[i].yooksam[1] == 3) goong[i].kyukkuk += "車絶馬死";
                    else if (goong[i].yooksam[0] == 2 && goong[i].yooksam[1] == 4) goong[i].kyukkuk += "耗散小格";
                    else if (goong[i].yooksam[0] == 2 && goong[i].yooksam[1] == 5) goong[i].kyukkuk += "反吟大格";

                    else if (goong[i].yooksam[0] == 3 && goong[i].yooksam[1] == 8) goong[i].kyukkuk += "白虎猖狂";
                    else if (goong[i].yooksam[0] == 3 && goong[i].yooksam[1] == 7) goong[i].kyukkuk += "干合孛師";
                    else if (goong[i].yooksam[0] == 3 && goong[i].yooksam[1] == 6) goong[i].kyukkuk += "獄神得奇";
                    else if (goong[i].yooksam[0] == 3 && goong[i].yooksam[1] == 0) goong[i].kyukkuk += "妄動禍殃";
                    else if (goong[i].yooksam[0] == 3 && goong[i].yooksam[1] == 1) goong[i].kyukkuk += "奴僕背主";
                    else if (goong[i].yooksam[0] == 3 && goong[i].yooksam[1] == 2) goong[i].kyukkuk += "白虎出力";
                    else if (goong[i].yooksam[0] == 3 && goong[i].yooksam[1] == 3) goong[i].kyukkuk += "白虎兩立";
                    else if (goong[i].yooksam[0] == 3 && goong[i].yooksam[1] == 4) goong[i].kyukkuk += "寒塘月影";
                    else if (goong[i].yooksam[0] == 3 && goong[i].yooksam[1] == 5) goong[i].kyukkuk += "誤入天網";

                    else if (goong[i].yooksam[0] == 4 && goong[i].yooksam[1] == 8) goong[i].kyukkuk += "逐水桃花";
                    else if (goong[i].yooksam[0] == 4 && goong[i].yooksam[1] == 7) goong[i].kyukkuk += "日落西海";
                    else if (goong[i].yooksam[0] == 4 && goong[i].yooksam[1] == 6) goong[i].kyukkuk += "干合星奇";
                    else if (goong[i].yooksam[0] == 4 && goong[i].yooksam[1] == 0) goong[i].kyukkuk += "小蛇化龍";
                    else if (goong[i].yooksam[0] == 4 && goong[i].yooksam[1] == 1) goong[i].kyukkuk += "凶蛇入獄";
                    else if (goong[i].yooksam[0] == 4 && goong[i].yooksam[1] == 2) goong[i].kyukkuk += "太白擒蛇";
                    else if (goong[i].yooksam[0] == 4 && goong[i].yooksam[1] == 3) goong[i].kyukkuk += "淘洗珠玉";
                    else if (goong[i].yooksam[0] == 4 && goong[i].yooksam[1] == 4) goong[i].kyukkuk += "伏吟地網";
                    else if (goong[i].yooksam[0] == 4 && goong[i].yooksam[1] == 5) goong[i].kyukkuk += "幼女奸淫";

                    else if (goong[i].yooksam[0] == 5 && goong[i].yooksam[1] == 8) goong[i].kyukkuk += "梨花春雨";
                    else if (goong[i].yooksam[0] == 5 && goong[i].yooksam[1] == 7) goong[i].kyukkuk += "日出霧散";
                    else if (goong[i].yooksam[0] == 5 && goong[i].yooksam[1] == 6) goong[i].kyukkuk += "螣蛇妖嬌";
                    else if (goong[i].yooksam[0] == 5 && goong[i].yooksam[1] == 0) goong[i].kyukkuk += "困時得助";
                    else if (goong[i].yooksam[0] == 5 && goong[i].yooksam[1] == 1) goong[i].kyukkuk += "音信皆阻";
                    else if (goong[i].yooksam[0] == 5 && goong[i].yooksam[1] == 2) goong[i].kyukkuk += "太白入網";
                    else if (goong[i].yooksam[0] == 5 && goong[i].yooksam[1] == 3) goong[i].kyukkuk += "網蓋天牢";
                    else if (goong[i].yooksam[0] == 5 && goong[i].yooksam[1] == 4) goong[i].kyukkuk += "復見騰蛇";
                    else if (goong[i].yooksam[0] == 5 && goong[i].yooksam[1] == 5) goong[i].kyukkuk += "伏吟天羅";


                if (i == 2 && goong[i].yooksam[0] == 8) goong[i].kyukkuk += " 乙奇陞殿";
                if (i == 8 && goong[i].yooksam[0] ==7) goong[i].kyukkuk += " 丙奇陞殿";
                if (i == 6 && goong[i].yooksam[0] == 6) goong[i].kyukkuk += " 丁奇陞殿";

                if (goong[i].yooksam[0] == 8 &&(goong[i].eightmun == 6 || goong[i].eightmun == 7 || goong[i].eightmun == 0)) goong[i].kyukkuk += " 乙奇上吉門";
                if (goong[i].yooksam[0] == 7 && (goong[i].eightmun == 6 || goong[i].eightmun == 7 || goong[i].eightmun == 0)) goong[i].kyukkuk += " 丙奇上吉門";
                if (goong[i].yooksam[0] == 6 && (goong[i].eightmun == 6 || goong[i].eightmun == 7 || goong[i].eightmun == 0)) goong[i].kyukkuk += " 丁奇上吉門";

                if (goong[i].yooksam[0] == 6 && goong[i].eightmun == 0) goong[i].kyukkuk += " 玉女守門";


                if (goong[i].yooksam[1] == 7 && goong[i].yooksam[0] == 7) goong[i].kyukkuk += "";
                else if ((toYookSam(goong[i].yooksam[1]) == toGan(sjGanzi[0][0]) && goong[i].yooksam[0] == 7) || (toYookSam(goong[i].yooksam[0]) == toGan(sjGanzi[0][0]) && goong[i].yooksam[1] == 7)) goong[i].kyukkuk += " 悖亂";
                else if ((toYookSam(goong[i].yooksam[1]) == toGan(sjGanzi[1][0]) && goong[i].yooksam[0] == 7) || (toYookSam(goong[i].yooksam[0]) == toGan(sjGanzi[1][0]) && goong[i].yooksam[1] == 7)) goong[i].kyukkuk += " 悖亂";
                else if ((toYookSam(goong[i].yooksam[1]) == toGan(sjGanzi[2][0]) && goong[i].yooksam[0] == 7) || (toYookSam(goong[i].yooksam[0]) == toGan(sjGanzi[2][0]) && goong[i].yooksam[1] == 7)) goong[i].kyukkuk += " 悖亂";
                else if ((toYookSam(goong[i].yooksam[1]) == toGan(sjGanzi[3][0]) && goong[i].yooksam[0] == 7) || (toYookSam(goong[i].yooksam[0]) == toGan(sjGanzi[3][0]) && goong[i].yooksam[1] == 7)) goong[i].kyukkuk += " 悖亂";




                if      ((toYookSam(goong[i].yooksam[1]) == toGan(sjGanzi[0][0]) && goong[i].yooksam[0] == 5) ||
                         (toYookSam(goong[i].yooksam[0]) == toGan(sjGanzi[0][0]) && goong[i].yooksam[1] == 5)) goong[i].kyukkuk += " 天網四張";
                else if ((toYookSam(goong[i].yooksam[1]) == toGan(sjGanzi[1][0]) && goong[i].yooksam[0] == 5) ||
                         (toYookSam(goong[i].yooksam[0]) == toGan(sjGanzi[1][0]) && goong[i].yooksam[1] == 5)) goong[i].kyukkuk += " 天網四張";
                else if ((toYookSam(goong[i].yooksam[1]) == toGan(sjGanzi[2][0]) && goong[i].yooksam[0] == 5) ||
                         (toYookSam(goong[i].yooksam[0]) == toGan(sjGanzi[2][0]) && goong[i].yooksam[1] == 5)) goong[i].kyukkuk += " 天網四張";
                else if ((toYookSam(goong[i].yooksam[1]) == toGan(sjGanzi[3][0]) && goong[i].yooksam[0] == 5) ||
                         (toYookSam(goong[i].yooksam[0]) == toGan(sjGanzi[3][0]) && goong[i].yooksam[1] == 5)) goong[i].kyukkuk += " 天網四張";

                if      ((toYookSam(goong[i].yooksam[1]) == toGan(sjGanzi[0][0]) && goong[i].yooksam[0] == 4) ||
                         (toYookSam(goong[i].yooksam[0]) == toGan(sjGanzi[0][0]) && goong[i].yooksam[1] == 4)) goong[i].kyukkuk += " 地網遮蔽";
                else if ((toYookSam(goong[i].yooksam[1]) == toGan(sjGanzi[1][0]) && goong[i].yooksam[0] == 4) ||
                         (toYookSam(goong[i].yooksam[0]) == toGan(sjGanzi[1][0]) && goong[i].yooksam[1] == 4)) goong[i].kyukkuk += " 地網遮蔽";
                else if ((toYookSam(goong[i].yooksam[1]) == toGan(sjGanzi[2][0]) && goong[i].yooksam[0] == 4) ||
                         (toYookSam(goong[i].yooksam[0]) == toGan(sjGanzi[2][0]) && goong[i].yooksam[1] == 4)) goong[i].kyukkuk += " 地網遮蔽";
                else if ((toYookSam(goong[i].yooksam[1]) == toGan(sjGanzi[3][0]) && goong[i].yooksam[0] == 4) ||
                         (toYookSam(goong[i].yooksam[0]) == toGan(sjGanzi[3][0]) && goong[i].yooksam[1] == 4)) goong[i].kyukkuk += " 地網遮蔽";





                if (i == 3 && (goong[i].yooksam[0] == 4 || goong[i].yooksam[0] == 5)) goong[i].kyukkuk += " 六儀擊形";
                else if (i == 8 && (goong[i].yooksam[0] == 3)) goong[i].kyukkuk += " 六儀擊形";
                else if (i == 1 && (goong[i].yooksam[0] == 1)) goong[i].kyukkuk += " 六儀擊形";
                else if (i == 2 && (goong[i].yooksam[0] == 0)) goong[i].kyukkuk += " 六儀擊形";
                else if (i == 7 && (goong[i].yooksam[0] == 2)) goong[i].kyukkuk += " 六儀擊形";

                if (i == 5 && goong[i].yooksam[0] == 8) goong[i].kyukkuk += " 乙奇入墓";
                if (i == 5 && goong[i].yooksam[0] == 7) goong[i].kyukkuk += " 丙奇入墓";
                if (i == 7 && goong[i].yooksam[0] == 6) goong[i].kyukkuk += " 丁奇入墓";
                }
            }
        }

export function setIsabangui(goong: Goong[], sjGanzi: number[][]): void
        {

        }

export function setBatangguk(goong: Goong[]): string
        {
            if (goong[4].hongNum[0] == 3 && goong[4].hongNum[1] == 5) return "戰局";
            else if (goong[4].hongNum[0] == 2 && goong[4].hongNum[1] == 5) return "沖局";
            else if (goong[4].hongNum[0] == 8 && goong[4].hongNum[1] == 5) return "沖局";
            else if (goong[4].hongNum[0] == 7 && goong[4].hongNum[1] == 5) return "怨嗔局";
            else if (goong[4].hongNum[0] == 5 && goong[4].hongNum[1] == 5) return "刑破害局";
            else if ((goong[4].hongNum[0] + goong[4].hongNum[1])%10 == 4 || (goong[4].hongNum[0] + goong[4].hongNum[1])% 10 == 9 || (goong[4].hongNum[0] + goong[4].hongNum[1])% 10 == 0)
                return "和局";
            else if ((goong[4].hongNum[0] + goong[4].hongNum[1])% 10 == 1 || (goong[4].hongNum[0] + goong[4].hongNum[1])% 10 == 3 || (goong[4].hongNum[0] + goong[4].hongNum[1])% 10 == 6)
                return "戰局";
            else if ((goong[4].hongNum[0] + goong[4].hongNum[1])% 10 == 2 || (goong[4].hongNum[0] + goong[4].hongNum[1])% 10 == 8)
                return "沖局";
            else if ((goong[4].hongNum[0] + goong[4].hongNum[1])% 10 == 7)
                return "怨嗔局";
            else if ((goong[4].hongNum[0] + goong[4].hongNum[1])% 10 == 5)
                return "刑破害局";
            else return "";
        }

export function setBatangguk1(goong: Goong[]): string
        {
            if (goong[4].hongNum[0] == 3 && goong[4].hongNum[1] == 5) return "戰";
            else if (goong[4].hongNum[0] == 2 && goong[4].hongNum[1] == 5) return "沖";
            else if (goong[4].hongNum[0] == 8 && goong[4].hongNum[1] == 5) return "沖";
            else if (goong[4].hongNum[0] == 7 && goong[4].hongNum[1] == 5) return "怨";
            else if (goong[4].hongNum[0] == 5 && goong[4].hongNum[1] == 5) return "破";
            else if ((goong[4].hongNum[0] + goong[4].hongNum[1]) % 10 == 4 || (goong[4].hongNum[0] + goong[4].hongNum[1]) % 10 == 9 || (goong[4].hongNum[0] + goong[4].hongNum[1]) % 10 == 0)
                return "和";
            else if ((goong[4].hongNum[0] + goong[4].hongNum[1]) % 10 == 1 || (goong[4].hongNum[0] + goong[4].hongNum[1]) % 10 == 3 || (goong[4].hongNum[0] + goong[4].hongNum[1]) % 10 == 6)
                return "戰";
            else if ((goong[4].hongNum[0] + goong[4].hongNum[1]) % 10 == 2 || (goong[4].hongNum[0] + goong[4].hongNum[1]) % 10 == 8)
                return "沖";
            else if ((goong[4].hongNum[0] + goong[4].hongNum[1]) % 10 == 7)
                return "怨";
            else if ((goong[4].hongNum[0] + goong[4].hongNum[1]) % 10 == 5)
                return "破";
            else return "";
        }

export function setTaeulGusung(goong: Goong[], sjGanzi: number[][], direction: boolean): void
        {
            const plus = [ 7, 8, 0, 1, 2, 3 ];
            const minus = [ 1, 0, 8, 7, 6, 5 ];

           let i = 0, j = 0, k = 0, l = 0;
            i = sjGanzi[2][1];
            j = sjGanzi[2][0];

            if (i - j == 0) k = 0;
            else if ((i - j + 12) % 12 == 10) k = 1;
            else if ((i - j + 12) % 12 == 8) k = 2;
            else if ((i - j + 12) % 12 == 6) k = 3;
            else if ((i - j + 12) % 12 == 4) k = 4;
            else  k = 5;

            if (direction)
            {
                for (l = 0; l < 9; l++)
                {
                    goong[(plus[k] + (j - 1) + l) % 9].taeulgusung = l;
                }
            }
            else
            {
                for (l = 0; l < 9; l++)
                {
                    goong[(minus[k] - (j - 1) - l + 18) % 9].taeulgusung = l;
                }
            }
        }

export function getGanYooksin(i: number, j: number): string
        {
            let text = "";

            let batang_ohaeng = Math.trunc((i - 1) / 2);
            let temp_Ohaeng = Math.trunc((j - 1) / 2);

            if (batang_ohaeng == temp_Ohaeng)
            {
                if ((j % 2 == 1 && i % 2 == 1) || (j % 2 == 0 && i % 2 == 0)) text = "비견";
                else text = "겁재";
            }

            else if ((j % 2 == 1 && i % 2 == 1) || (j % 2 == 0 && i % 2 == 0))
            {
                if (temp_Ohaeng - batang_ohaeng == 1 || temp_Ohaeng - batang_ohaeng == -4) text = "식신";
                else if (batang_ohaeng - temp_Ohaeng == 1 || batang_ohaeng - temp_Ohaeng == -4) text = "편인";
                else if (temp_Ohaeng - batang_ohaeng == 2 || temp_Ohaeng - batang_ohaeng == -3) text = "편재";
                else text = "편관";
            }

            else
            {
                if (temp_Ohaeng - batang_ohaeng == 1 || temp_Ohaeng - batang_ohaeng == -4) text = "상관";
                else if (batang_ohaeng - temp_Ohaeng == 1 || batang_ohaeng - temp_Ohaeng == -4) text = "정인";
                else if (temp_Ohaeng - batang_ohaeng == 2 || temp_Ohaeng - batang_ohaeng == -3) text = "정재";
                else text = "정관";
            }
            return text;
        }

export function getZiYooksin(i: number, j: number): string
        {
            let text = "";

            let batang_ohaeng = Math.trunc((i - 1) / 2);
            let temp_Ohaeng = 0, b = 0;

            if (j == 3 || j == 4) temp_Ohaeng = 0;
            else if (j == 6 || j == 7) temp_Ohaeng = 1;
            else if (j == 5 || j == 11 || j == 2 || j == 8) temp_Ohaeng = 2;
            else if (j == 9 || j == 10) temp_Ohaeng = 3;
            else temp_Ohaeng = 4;

            if (j == 3 || j == 6 || j == 5 || j == 11 || j == 9 || j == 12) b = 1;
            else b = 0;

            if (batang_ohaeng == temp_Ohaeng)
            {
                if ((b == 1 && i % 2 == 1) || (b == 0 && i % 2 == 0)) text = "비견";
                else text = "겁재";
            }

            else if ((b == 1 && i % 2 == 1) || (b == 0 && i % 2 == 0))
            {
                if (temp_Ohaeng - batang_ohaeng == 1 || temp_Ohaeng - batang_ohaeng == -4) text = "식신";
                else if (batang_ohaeng - temp_Ohaeng == 1 || batang_ohaeng - temp_Ohaeng == -4) text = "편인";
                else if (temp_Ohaeng - batang_ohaeng == 2 || temp_Ohaeng - batang_ohaeng == -3) text = "편재";
                else text = "편관";
            }

            else
            {
                if (temp_Ohaeng - batang_ohaeng == 1 || temp_Ohaeng - batang_ohaeng == -4) text = "상관";
                else if (batang_ohaeng - temp_Ohaeng == 1 || batang_ohaeng - temp_Ohaeng == -4) text = "정인";
                else if (temp_Ohaeng - batang_ohaeng == 2 || temp_Ohaeng - batang_ohaeng == -3) text = "정재";
                else text = "정관";
            }
            return text;
        }

export function zi2Goong(zi: number): number
        {
            let goong = -1;
            if (zi == 1) goong = 1;
            else if (zi == 2) goong = 10;
            else if (zi == 3) goong = 3;
            else if (zi == 4) goong = 8;
            else if (zi == 5) goong = 5;
            else if (zi == 6) goong = 2;
            else if (zi == 7) goong = 7;
            else if (zi == 8) goong = 10;
            else if (zi == 9) goong = 9;
            else if (zi == 10) goong = 4;
            else if (zi == 11) goong = 5;
            else  goong = 6;

            return goong;
        }

export function setJoSang(goong: Goong[], sjGanzi: number[][]): void
        {
            let jogaek = 0, sangmun = 0;
            let jogaek_hongNumber = 0, sangmun_hongNumber = 0;
            let isjogaek = false, issangmun = false;

            jogaek = sjGanzi[0][1] - 2;
            if (jogaek < 0) jogaek = 12 + jogaek;
            sangmun = sjGanzi[0][1] + 2;
            if (sangmun > 11) sangmun = sangmun - 12;

            if (sjGanzi[1][1] == jogaek || sjGanzi[2][1] == jogaek || sjGanzi[3][1] == jogaek) isjogaek = true;
            else isjogaek = false;
            if (sjGanzi[1][1] == sangmun || sjGanzi[2][1] == sangmun || sjGanzi[3][1] == sangmun) issangmun = true;
            else issangmun = false;

            jogaek_hongNumber = zi2Goong(jogaek);
            sangmun_hongNumber = zi2Goong(sangmun);

            for (let i = 0; i < 9; i++)
            {
                if (isjogaek)
                {
                    if (goong[i].hongNum[1] == jogaek_hongNumber)
                        goong[i].josang = "弔客";
                    else if (i == 4)
                    {
                        if(goong[i].hongNum[1] + 5 == jogaek_hongNumber || goong[i].hongNum[1] - 5 == jogaek_hongNumber) goong[i].josang = "(弔客)";
                    }
                }
                if (issangmun)
                {
                    if (goong[i].hongNum[1] == sangmun_hongNumber)
                        goong[i].josang = "喪門";
                    else if (i == 4)
                    {
                        if (goong[i].hongNum[1] + 5 == sangmun_hongNumber || goong[i].hongNum[1] - 5 == sangmun_hongNumber) goong[i].josang = "(喪門)";
                    }
                }
            }
        }

