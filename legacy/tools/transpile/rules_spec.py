HEADER = '''// 자동 생성: tools/transpile/gen_rules.py 가 SajuEngine.Core.cs 에서 옮긴 계산 규칙.
// 규칙을 바꿀 때는 C# 쪽을 고친 뒤 다시 생성하거나, 이 파일을 신중히 직접 수정한다.
import { Goong } from "./types";
import { Dt } from "./datetime";
import { getohaeng_dt } from "./calendarRules";

'''

ORDER = """toGan toZi toNum toOhaeng toOhaeng_1 toSixSin toHongNumLvl toYookSam toJeolGi to8Mun to8Mun2 to8Goe toMunWang toGooSung
toCheonMaRok toEunSung toFourgan bokgankyuk toSaji toTaeulGusung getPakjehwaeui setHongNum setfourGan setDongcheo setSixSin setHonglvl
getohaeng setYooAge set8mun settime8mun set8goe setGooSung setEightjang setCheonMaRok swapstring setEunsung setGongMang setSinsal
setKyukkuk setIsabangui setBatangguk setBatangguk1 setTaeulGusung getGanYooksin getZiYooksin zi2Goong setJoSang""".split()

TS_SIG = {}
for n in "toGan toZi toNum toOhaeng toOhaeng_1 toSixSin toHongNumLvl toYookSam toJeolGi to8Mun to8Mun2 to8Goe toMunWang toGooSung toEunSung".split():
    TS_SIG[n] = n + "(num: number): string"
TS_SIG.update({
    "toTaeulGusung": "toTaeulGusung(i: number): string",
    "toCheonMaRok": "toCheonMaRok(cheoneul: number, cheonma: number, ilrok: number): string",
    "toFourgan": "toFourgan(num: number, goong: Goong[], sjGanzi: number[][]): string",
    "bokgankyuk": "bokgankyuk(num: number, goong: Goong[], sjGanzi: number[][]): string",
    "toSaji": "toSaji(b_dong: boolean[], i: number): string",
    "getPakjehwaeui": "getPakjehwaeui(mun: number, goong: number): number",
    "setHongNum": "setHongNum(goong: Goong[], sjGanzi: number[][]): { eunboksu1: number; eunboksu2: number }",
    "setfourGan": "setfourGan(goong: Goong[], sjGanzi: number[][]): void",
    "setDongcheo": "setDongcheo(goong: Goong[], sjGanzi: number[][]): void",
    "setSixSin": "setSixSin(goong: Goong[], sjGanzi: number[][]): void",
    "setHonglvl": "setHonglvl(goong: Goong[], month: number, dt: Dt): void",
    "getohaeng": "getohaeng(num: number, type: number): number",
    "setYooAge": "setYooAge(goong: Goong[], t1: number, t2: number): void",
    "set8mun": "set8mun(goong: Goong[], sjGanzi: number[][], direction: boolean): void",
    "settime8mun": "settime8mun(goong: Goong[], sjGanzi: number[][], direction: boolean): void",
    "set8goe": "set8goe(goong: Goong[]): void",
    "setGooSung": "setGooSung(goong: Goong[], sjGanzi: number[][], sisunsoo: number): void",
    "setEightjang": "setEightjang(goong: Goong[], sjGanzi: number[][], direction: boolean, sisunsoo: number): void",
    "setCheonMaRok": "setCheonMaRok(goong: Goong[], sjGanzi: number[][], direction: boolean): void",
    "swapstring": "swapstring(str: string): string",
    "setEunsung": "setEunsung(goong: Goong[], sjGanzi: number[][]): void",
    "setGongMang": "setGongMang(goong: Goong[], sjGanzi: number[][]): void",
    "setSinsal": "setSinsal(goong: Goong[], sjGanzi: number[][]): void",
    "setKyukkuk": "setKyukkuk(goong: Goong[], sjGanzi: number[][]): void",
    "setIsabangui": "setIsabangui(goong: Goong[], sjGanzi: number[][]): void",
    "setBatangguk": "setBatangguk(goong: Goong[]): string",
    "setBatangguk1": "setBatangguk1(goong: Goong[]): string",
    "setTaeulGusung": "setTaeulGusung(goong: Goong[], sjGanzi: number[][], direction: boolean): void",
    "getGanYooksin": "getGanYooksin(i: number, j: number): string",
    "getZiYooksin": "getZiYooksin(i: number, j: number): string",
    "zi2Goong": "zi2Goong(zi: number): number",
    "setJoSang": "setJoSang(goong: Goong[], sjGanzi: number[][]): void",
})

# 오자원(일주/시주) 찾기: goto -> 라벨 break
FIND_5X12 = (r"for \(i = 0; i < 5; i\+\+\)\s*for \(j = 0; j < 12; j\+\+\)\s*\{\s*if \(day\[i\]\[j\] == temp\) goto EXIT_FOR;\s*\}\s*EXIT_FOR:",
             "EXIT_FOR: for (i = 0; i < 5; i++)\n        for (j = 0; j < 12; j++) {\n            if (day[i][j] == temp) break EXIT_FOR;\n        }")

PATCHES = {
    "setHongNum": [
        ("let t1 = 0, t2 = 0;", "let t1 = 0, t2 = 0, eunboksu1 = 0, eunboksu2 = 0;"),
        (r"re:\n        \}\s*$", "\n        return { eunboksu1, eunboksu2 };\n        }"),
    ],
    "set8goe": [("int[] temp = new int[3];", "const temp: number[] = [0, 0, 0];"), ("goe[goong[4].hongNum[1] - 1, i]", "goe[goong[4].hongNum[1] - 1][i]")],
    "swapstring": [("ostr = temp.Substring(1, 1) + temp.Substring(0, 1);", "return temp.substring(1, 2) + temp.substring(0, 1);")],
    "set8mun": [("re:" + FIND_5X12[0], FIND_5X12[1]), ("j/3", "Math.trunc(j / 3)")],
    "settime8mun": [("re:" + FIND_5X12[0], FIND_5X12[1])],
    "setEunsung": [(r"re:swapstring\((goong\[\d\]\.eunsung), out goong\[\d\]\.eunsung\);", r"\1 = swapstring(\1);")],
    "setSinsal": [
        (r"re:for \(i=0;i<4;i\+\+\)\s*for\(j=0;j<3;j\+\+\)\s*if \(samhab\[i\]\[j\] == sjGanzi\[0\]\[1\]-1\) goto EXIT1;\s*EXIT1:",
         "EXIT1: for (i = 0; i < 4; i++)\n        for (j = 0; j < 3; j++)\n            if (samhab[i][j] == sjGanzi[0][1] - 1) break EXIT1;"),
        (r"re:for \(i = 0; i < 4; i\+\+\)\s*for \(j = 0; j < 3; j\+\+\)\s*if \(samhab\[i\]\[j\] == sjGanzi\[2\]\[1\]-1\) goto EXIT2;\s*EXIT2:",
         "EXIT2: for (i = 0; i < 4; i++)\n        for (j = 0; j < 3; j++)\n            if (samhab[i][j] == sjGanzi[2][1] - 1) break EXIT2;"),
    ],
    "getGanYooksin": [("(i-1)/2", "Math.trunc((i - 1) / 2)"), ("(j-1)/2", "Math.trunc((j - 1) / 2)")],
    "getZiYooksin": [("(i - 1) / 2", "Math.trunc((i - 1) / 2)")],
}
