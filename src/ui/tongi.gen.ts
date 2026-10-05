// 자동 생성: tools/transpile/gen_tongi.py (원본 C# showTongGido / showTongGido_1 를 옮긴 것). 직접 고치지 마세요.
import { Goong, toNum, toSixSin, toOhaeng } from "../engine/index";

export interface LabelState { text: string; visible: boolean; fore: string; back: string }
export type LabelMap = Record<string, LabelState>;
export interface TongiState {
  pictureBox1: boolean;     // 단1 그림 표시
  pictureBox3: boolean;     // 단2 그림 표시
  centerColor: string;      // 단1 가운데 원 색 (오행)
  ringLayout: boolean;      // 단2 고리 위 라벨 배치 필요
}

const rgb = (r: number, g: number, b: number): string =>
  "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");

/** 단1 통기도 (원 그림 + 6친 라벨) */
export function showTongGido1(goong: Goong[], L: LabelMap, S: TongiState): void {
            S.pictureBox3 = false;

            L.label111.visible = false;
            L.label110.visible = false;
            L.label109.visible = false;
            L.label108.visible = false;
            L.label107.visible = false;
            L.label106.visible = false;
            L.label105.visible = false;
            L.label104.visible = false;
            L.label103.visible = false;
            L.label112.visible = false;
            L.label86.visible = false;
            L.label85.visible = false;
            L.label84.visible = false;
            L.label83.visible = false;
            L.label82.visible = false;
            L.label81.visible = false;
            L.label80.visible = false;
            L.label79.visible = false;
            L.label78.visible = false;
            L.label87.visible = false;
            L.label102.visible = false;
            L.label101.visible = false;
            L.label100.visible = false;
            L.label90.visible = false;
            L.label89.visible = false;

            S.pictureBox1 = true;
            L.label41.visible = true;
            L.label42.visible = true;
            L.label43.visible = true;
            L.label44.visible = true;
            L.label45.visible = true;
            L.label46.visible = true;
            L.label47.visible = true;
            L.label48.visible = true;
            L.label49.visible = true;
            L.label50.visible = true;
            L.label61.visible = true;
            L.label62.visible = true;
            L.label63.visible = true;
            L.label64.visible = true;
            L.label65.visible = true;
            L.label66.visible = true;
            L.label67.visible = true;
            L.label68.visible = true;
            L.label69.visible = true;
            L.label70.visible = true;
            L.label51.visible = true;
            L.label59.visible = true;
            L.label21.visible = true;
            L.label23.visible = true;
            L.label24.visible = true;
            L.label25.visible = true;
            L.label26.visible = true;
            L.label27.visible = true;
            L.label57.visible = true;
            L.label58.visible = true;

            const idx = [ false, false, false, false, false, false, false, false, false, false ];
            const t = [ 4, 9, 1, 6, 3, 8, 2, 7, 5, 10 ];
            L.label41.text = "";
            L.label42.text = "";
            L.label43.text = "";
            L.label44.text = "";
            L.label45.text = "";
            L.label46.text = "";
            L.label47.text = "";
            L.label48.text = "";
            L.label49.text = "";
            L.label50.text = "";
            L.label59.text = "";
            L.label61.text = "";
            L.label62.text = "";
            L.label63.text = "";
            L.label64.text = "";
            L.label65.text = "";
            L.label66.text = "";
            L.label67.text = "";
            L.label68.text = "";
            L.label69.text = "";
            L.label70.text = "";
            let i = 0, j = 0;

            L.label41.back = rgb(255, 229, 229);
            L.label42.back = rgb(255, 229, 229);
            L.label43.back = rgb(255, 229, 229);
            L.label44.back = rgb(255, 229, 229);
            L.label45.back = rgb(255, 229, 229);
            L.label46.back = rgb(255, 229, 229);
            L.label47.back = rgb(255, 229, 229);
            L.label48.back = rgb(255, 229, 229);
            L.label49.back = rgb(255, 229, 229);
            L.label50.back = rgb(255, 229, 229);
            L.label61.back = rgb(255, 229, 229);
            L.label62.back = rgb(255, 229, 229);
            L.label63.back = rgb(255, 229, 229);
            L.label64.back = rgb(255, 229, 229);
            L.label65.back = rgb(255, 229, 229);
            L.label66.back = rgb(255, 229, 229);
            L.label67.back = rgb(255, 229, 229);
            L.label68.back = rgb(255, 229, 229);
            L.label69.back = rgb(255, 229, 229);
            L.label70.back = rgb(255, 229, 229);
            L.label51.back = rgb(255, 229, 229);

            for (i = 0; i < 9; i++)
            {
                if (i == 4)
                {
                    if (toSixSin(goong[i].six_sin[1]) == "兄") { idx[0] = true; L.label61.text = toNum(goong[i].hongNum[1]) + "中"; }
                    if (toSixSin(goong[i].six_sin[0]) == "兄") { idx[1] = true; L.label42.text = toNum(goong[i].hongNum[0]) + "中"; }
                    if (toSixSin(goong[i].six_sin[1]) == "孫") { idx[2] = true; L.label43.text = toNum(goong[i].hongNum[1]) + "中"; }
                    if (toSixSin(goong[i].six_sin[0]) == "父") { idx[3] = true; L.label44.text = toNum(goong[i].hongNum[0]) + "中"; }
                    if (toSixSin(goong[i].six_sin[1]) == "財") { idx[4] = true; L.label45.text = toNum(goong[i].hongNum[1]) + "中"; }
                    if (toSixSin(goong[i].six_sin[0]) == "官" || toSixSin(goong[i].six_sin[0]) == "鬼") { idx[5] = true; L.label46.text = toNum(goong[i].hongNum[0]) + "中"; }
                    if (toSixSin(goong[i].six_sin[1]) == "官" || toSixSin(goong[i].six_sin[1]) == "鬼") { idx[6] = true; L.label47.text = toNum(goong[i].hongNum[1]) + "中"; }
                    if (toSixSin(goong[i].six_sin[0]) == "財") { idx[7] = true; L.label48.text = toNum(goong[i].hongNum[0]) + "中"; }
                    if (toSixSin(goong[i].six_sin[1]) == "父") { idx[8] = true; L.label49.text = toNum(goong[i].hongNum[1]) + "中"; }
                    if (toSixSin(goong[i].six_sin[0]) == "孫") { idx[9] = true; L.label50.text = toNum(goong[i].hongNum[0]) + "中"; }
                }

                else
                {
                    if (toSixSin(goong[i].six_sin[1]) == "世")
                        L.label41.text = toNum(goong[i].hongNum[1]) + "世";
                    L.label41.fore = "#ff0000";

                    if (toSixSin(goong[i].six_sin[1]) == "兄")
                    {
                        if (goong[i].b_dong[0] == true)
                            L.label61.text = toNum(goong[i].hongNum[1]) + "年";
                        else if (goong[i].b_dong[1] == true)
                            L.label61.text = toNum(goong[i].hongNum[1]) + "月";
                        else if (goong[i].b_dong[2] == true)
                            L.label61.text = toNum(goong[i].hongNum[1]) + "日";
                        else if (goong[i].b_dong[3] == true)
                            L.label61.text = toNum(goong[i].hongNum[1]) + "時";
                    }

                    if (toSixSin(goong[i].six_sin[0]) == "兄")
                    {
                        if (idx[1] == false)
                        {
                            idx[1] = true;
                            if (goong[i].b_dong[0] == true)
                                L.label42.text = toNum(goong[i].hongNum[0]) + "年";
                            else if (goong[i].b_dong[1] == true)
                                L.label42.text = toNum(goong[i].hongNum[0]) + "月";
                            else if (goong[i].b_dong[2] == true)
                                L.label42.text = toNum(goong[i].hongNum[0]) + "日";
                            else if (goong[i].b_dong[3] == true)
                                L.label42.text = toNum(goong[i].hongNum[0]) + "時";
                            else idx[1] = false;
                        }
                        else if (L.label42.text.includes(toNum(goong[i].hongNum[0]))) {}
                        else if (goong[i].b_dong[0] == true)
                            L.label59.text = toNum(goong[i].hongNum[0]) + "年";
                        else if (goong[i].b_dong[1] == true)
                            L.label59.text = toNum(goong[i].hongNum[0]) + "月";
                        else if (goong[i].b_dong[2] == true)
                            L.label59.text = toNum(goong[i].hongNum[0]) + "日";
                        else if (goong[i].b_dong[3] == true)
                            L.label59.text = toNum(goong[i].hongNum[0]) + "時";
                    }

                    if (toSixSin(goong[i].six_sin[1]) == "孫")
                    {
                        if (idx[2] == false)
                        {
                            idx[2] = true;
                            if (goong[i].b_dong[0] == true)
                                L.label43.text = toNum(goong[i].hongNum[1]) + "年";
                            else if (goong[i].b_dong[1] == true)
                                L.label43.text = toNum(goong[i].hongNum[1]) + "月";
                            else if (goong[i].b_dong[3] == true)
                                L.label43.text = toNum(goong[i].hongNum[1]) + "時";
                            else idx[2] = false;
                        }
                        else if (L.label43.text.includes(toNum(goong[i].hongNum[1]))) {}
                        else if (goong[i].b_dong[0] == true)
                            L.label63.text = toNum(goong[i].hongNum[1]) + "年";
                        else if (goong[i].b_dong[1] == true)
                            L.label63.text = toNum(goong[i].hongNum[1]) + "月";
                        else if (goong[i].b_dong[3] == true)
                            L.label63.text = toNum(goong[i].hongNum[1]) + "時";
                    }
                    if (toSixSin(goong[i].six_sin[0]) == "父")
                    {
                        if (idx[3] == false)
                        {
                            idx[3] = true;
                            if (goong[i].b_dong[0] == true)
                                L.label44.text = toNum(goong[i].hongNum[0]) + "年";
                            else if (goong[i].b_dong[1] == true)
                                L.label44.text = toNum(goong[i].hongNum[0]) + "月";
                            else if (goong[i].b_dong[2] == true)
                                L.label44.text = toNum(goong[i].hongNum[0]) + "日";
                            else if (goong[i].b_dong[3] == true)
                                L.label44.text = toNum(goong[i].hongNum[0]) + "時";
                            else idx[3] = false;
                        }
                        else if (L.label44.text.includes(toNum(goong[i].hongNum[0]))) {}
                        else if (goong[i].b_dong[0] == true)
                            L.label64.text = toNum(goong[i].hongNum[0]) + "年";
                        else if (goong[i].b_dong[1] == true)
                            L.label64.text = toNum(goong[i].hongNum[0]) + "月";
                        else if (goong[i].b_dong[2] == true)
                            L.label64.text = toNum(goong[i].hongNum[0]) + "日";
                        else if (goong[i].b_dong[3] == true)
                            L.label64.text = toNum(goong[i].hongNum[0]) + "時";
                    }
                    if (toSixSin(goong[i].six_sin[1]) == "財")
                    {
                        if (idx[4] == false)
                        {
                            idx[4] = true;
                            if (goong[i].b_dong[0] == true)
                                L.label45.text = toNum(goong[i].hongNum[1]) + "年";
                            else if (goong[i].b_dong[1] == true)
                                L.label45.text = toNum(goong[i].hongNum[1]) + "月";
                            else if (goong[i].b_dong[3] == true)
                                L.label45.text = toNum(goong[i].hongNum[1]) + "時";
                            else idx[4] = false;
                        }
                        else if (L.label45.text.includes(toNum(goong[i].hongNum[1]))) {}
                        else if (goong[i].b_dong[0] == true)
                            L.label65.text = toNum(goong[i].hongNum[1]) + "年";
                        else if (goong[i].b_dong[1] == true)
                            L.label65.text = toNum(goong[i].hongNum[1]) + "月";
                        else if (goong[i].b_dong[3] == true)
                            L.label65.text = toNum(goong[i].hongNum[1]) + "時";
                    }
                    if (toSixSin(goong[i].six_sin[0]) == "官" || toSixSin(goong[i].six_sin[0]) == "鬼")
                    {
                        if (idx[5] == false)
                        {
                            idx[5] = true;
                            if (goong[i].b_dong[0] == true)
                                L.label46.text = toNum(goong[i].hongNum[0]) + "年";
                            else if (goong[i].b_dong[1] == true)
                                L.label46.text = toNum(goong[i].hongNum[0]) + "月";
                            else if (goong[i].b_dong[2] == true)
                                L.label46.text = toNum(goong[i].hongNum[0]) + "日";
                            else if (goong[i].b_dong[3] == true)
                                L.label46.text = toNum(goong[i].hongNum[0]) + "時";
                            else idx[5] = false;
                        }
                        else if (L.label46.text.includes(toNum(goong[i].hongNum[0]))) {}
                        else if (goong[i].b_dong[0] == true)
                            L.label66.text = toNum(goong[i].hongNum[0]) + "年";
                        else if (goong[i].b_dong[1] == true)
                            L.label66.text = toNum(goong[i].hongNum[0]) + "月";
                        else if (goong[i].b_dong[2] == true)
                            L.label66.text = toNum(goong[i].hongNum[0]) + "日";
                        else if (goong[i].b_dong[3] == true)
                            L.label66.text = toNum(goong[i].hongNum[0]) + "時";
                    }
                    if (toSixSin(goong[i].six_sin[1]) == "官" || toSixSin(goong[i].six_sin[1]) == "鬼")
                    {
                        if (idx[6] == false)
                        {
                            idx[6] = true;

                            if (goong[i].b_dong[0] == true)
                                L.label47.text = toNum(goong[i].hongNum[1]) + "年";
                            else if (goong[i].b_dong[1] == true)
                                L.label47.text = toNum(goong[i].hongNum[1]) + "月";
                            else if (goong[i].b_dong[3] == true)
                                L.label47.text = toNum(goong[i].hongNum[1]) + "時";
                            else idx[6] = false;
                        }
                        else if (L.label47.text.includes(toNum(goong[i].hongNum[1]))) {}
                        else if (goong[i].b_dong[0] == true)
                            L.label67.text = toNum(goong[i].hongNum[1]) + "年";
                        else if (goong[i].b_dong[1] == true)
                            L.label67.text = toNum(goong[i].hongNum[1]) + "月";
                        else if (goong[i].b_dong[3] == true)
                            L.label67.text = toNum(goong[i].hongNum[1]) + "時";
                    }
                    if (toSixSin(goong[i].six_sin[0]) == "財")
                    {
                        if (idx[7] == false)
                        {
                            idx[7] = true;

                            if (goong[i].b_dong[0] == true)
                                L.label48.text = toNum(goong[i].hongNum[0]) + "年";
                            else if (goong[i].b_dong[1] == true)
                                L.label48.text = toNum(goong[i].hongNum[0]) + "月";
                            else if (goong[i].b_dong[2] == true)
                                L.label48.text = toNum(goong[i].hongNum[0]) + "日";
                            else if (goong[i].b_dong[3] == true)
                                L.label48.text = toNum(goong[i].hongNum[0]) + "時";
                            else idx[7] = false;
                        }
                        else if (L.label48.text.includes(toNum(goong[i].hongNum[0]))) {}
                        else if (goong[i].b_dong[0] == true)
                            L.label68.text = toNum(goong[i].hongNum[0]) + "年";
                        else if (goong[i].b_dong[1] == true)
                            L.label68.text = toNum(goong[i].hongNum[0]) + "月";
                        else if (goong[i].b_dong[2] == true)
                            L.label68.text = toNum(goong[i].hongNum[0]) + "日";
                        else if (goong[i].b_dong[3] == true)
                            L.label68.text = toNum(goong[i].hongNum[0]) + "時";
                    }
                    if (toSixSin(goong[i].six_sin[1]) == "父")
                    {
                        if (idx[8] == false)
                        {
                            idx[8] = true;

                            if (goong[i].b_dong[0] == true)
                                L.label49.text = toNum(goong[i].hongNum[1]) + "年";
                            else if (goong[i].b_dong[1] == true)
                                L.label49.text = toNum(goong[i].hongNum[1]) + "月";
                            else if (goong[i].b_dong[3] == true)
                                L.label49.text = toNum(goong[i].hongNum[1]) + "時";
                            else idx[8] = false;
                        }
                        else if (L.label49.text.includes(toNum(goong[i].hongNum[1]))) {}
                        else if (goong[i].b_dong[0] == true)
                            L.label69.text = toNum(goong[i].hongNum[1]) + "年";
                        else if (goong[i].b_dong[1] == true)
                            L.label69.text = toNum(goong[i].hongNum[1]) + "月";
                        else if (goong[i].b_dong[3] == true)
                            L.label69.text = toNum(goong[i].hongNum[1]) + "時";

                    }
                    if (toSixSin(goong[i].six_sin[0]) == "孫")
                    {
                        if (idx[9] == false)
                        {
                            idx[9] = true;

                            if (goong[i].b_dong[0] == true)
                                L.label50.text = toNum(goong[i].hongNum[0]) + "年";
                            else if (goong[i].b_dong[1] == true)
                                L.label50.text = toNum(goong[i].hongNum[0]) + "月";
                            else if (goong[i].b_dong[2] == true)
                                L.label50.text = toNum(goong[i].hongNum[0]) + "日";
                            else if (goong[i].b_dong[3] == true)
                                L.label50.text = toNum(goong[i].hongNum[0]) + "時";
                            else idx[9] = false;
                        }
                        else if (L.label50.text.includes(toNum(goong[i].hongNum[0]))) {}
                        else if (goong[i].b_dong[0] == true)
                            L.label70.text = toNum(goong[i].hongNum[0]) + "年";
                        else if (goong[i].b_dong[1] == true)
                            L.label70.text = toNum(goong[i].hongNum[0]) + "月";
                        else if (goong[i].b_dong[2] == true)
                            L.label70.text = toNum(goong[i].hongNum[0]) + "日";
                        else if (goong[i].b_dong[3] == true)
                            L.label70.text = toNum(goong[i].hongNum[0]) + "時";
                    }
                }
            }

            for (i = 0; i < 9 && goong[i].b_dong[2] !== true; i++) ;
            for (j = 0; j < 10 && goong[i].hongNum[1] != t[j]; j++) ;

            L.label51.text = toOhaeng(Math.trunc(j / 2));

            let myColor = "";
            if (L.label51.text == "金")
            {
                myColor = rgb(229, 229, 229);
            }
            else if (L.label51.text == "水")
            {
                myColor = rgb(204, 204, 204);

            }
            else if (L.label51.text == "木")
            {
                myColor = rgb(178, 255, 178);
            }
            else if (L.label51.text == "火")
            {
                myColor = rgb(255, 203, 203);
            }
            else
            {
                myColor = rgb(255, 189, 101);
            }

            S.centerColor = myColor;

            L.label51.back = myColor;
            L.label41.back = myColor;
            L.label61.back = myColor;
            L.label42.back = myColor;
            L.label62.back = myColor;
            L.label59.back = myColor;

}

/** 단2 통기도 (오각 그림 위 고리 라벨) */
export function showTongGido2(goong: Goong[], L: LabelMap, S: TongiState): void {
            S.pictureBox1 = false;

            L.label41.visible = false;
            L.label42.visible = false;
            L.label43.visible = false;
            L.label44.visible = false;
            L.label45.visible = false;
            L.label46.visible = false;
            L.label47.visible = false;
            L.label48.visible = false;
            L.label49.visible = false;
            L.label50.visible = false;
            L.label61.visible = false;
            L.label62.visible = false;
            L.label63.visible = false;
            L.label64.visible = false;
            L.label65.visible = false;
            L.label66.visible = false;
            L.label67.visible = false;
            L.label68.visible = false;
            L.label69.visible = false;
            L.label70.visible = false;
            L.label51.visible = false;
            L.label59.visible = false;
            L.label21.visible = false;
            L.label23.visible = false;
            L.label24.visible = false;
            L.label25.visible = false;
            L.label26.visible = false;
            L.label27.visible = false;
            L.label57.visible = false;
            L.label58.visible = false;

            S.pictureBox3 = true;

            L.label111.visible = true;
            L.label110.visible = true;
            L.label109.visible = true;
            L.label108.visible = true;
            L.label107.visible = true;
            L.label106.visible = true;
            L.label105.visible = true;
            L.label104.visible = true;
            L.label103.visible = true;
            L.label112.visible = true;
            L.label86.visible = true;
            L.label85.visible = true;
            L.label84.visible = true;
            L.label83.visible = true;
            L.label82.visible = true;
            L.label81.visible = true;
            L.label80.visible = true;
            L.label79.visible = true;
            L.label78.visible = true;
            L.label87.visible = true;
            L.label102.visible = true;
            L.label101.visible = true;
            L.label100.visible = true;
            L.label90.visible = true;
            L.label89.visible = true;

            L.label79.back = rgb(249, 237, 245);
            L.label81.back = rgb(249, 237, 245);
            L.label83.back = rgb(249, 237, 245);
            L.label85.back = rgb(249, 237, 245);
            L.label87.back = rgb(249, 237, 245);
            L.label112.back = rgb(249, 237, 245);
            L.label110.back = rgb(249, 237, 245);
            L.label108.back = rgb(249, 237, 245);
            L.label106.back = rgb(249, 237, 245);
            L.label104.back = rgb(249, 237, 245);

            L.label78.back = rgb(229, 229, 229);
            L.label80.back = rgb(229, 229, 229);
            L.label82.back = rgb(229, 229, 229);
            L.label84.back = rgb(229, 229, 229);
            L.label86.back = rgb(229, 229, 229);
            L.label111.back = rgb(229, 229, 229);
            L.label109.back = rgb(229, 229, 229);
            L.label107.back = rgb(229, 229, 229);
            L.label105.back = rgb(229, 229, 229);
            L.label103.back = rgb(229, 229, 229);

            L.label102.back = rgb(255, 255, 203);
            L.label101.back = rgb(255, 255, 203);
            L.label100.back = rgb(255, 255, 203);
            L.label90.back = rgb(255, 255, 203);
            L.label89.back = rgb(255, 255, 203);

            L.label86.fore = "#000000";
            L.label111.fore = "#000000";

            const idx = [ false, false, false, false, false, false, false, false, false, false ];
            const t = [ 4, 9, 1, 6, 3, 8, 2, 7, 5, 10 ];
            L.label111.text = "";
            L.label110.text = "";
            L.label109.text = "";
            L.label108.text = "";
            L.label107.text = "";
            L.label106.text = "";
            L.label105.text = "";
            L.label104.text = "";
            L.label103.text = "";
            L.label112.text = "";
            L.label86.text = "";
            L.label85.text = "";
            L.label84.text = "";
            L.label83.text = "";
            L.label82.text = "";
            L.label81.text = "";
            L.label80.text = "";
            L.label79.text = "";
            L.label78.text = "";
            L.label87.text = "";
            let i = 0, j = 0;

            for (i = 0; i < 9; i++)
            {
                if (i == 4)
                {
                    if (toSixSin(goong[i].six_sin[1]) == "兄") L.label86.text = toNum(goong[i].hongNum[1]) + "中";
                    if (toSixSin(goong[i].six_sin[0]) == "兄") { idx[1] = true; L.label110.text = toNum(goong[i].hongNum[0]) + "中"; }
                    if (toSixSin(goong[i].six_sin[1]) == "孫") { idx[2] = true; L.label109.text = toNum(goong[i].hongNum[1]) + "中"; }
                    if (toSixSin(goong[i].six_sin[0]) == "孫") { idx[3] = true; L.label108.text = toNum(goong[i].hongNum[0]) + "中"; }
                    if (toSixSin(goong[i].six_sin[1]) == "財") { idx[4] = true; L.label107.text = toNum(goong[i].hongNum[1]) + "中"; }
                    if (toSixSin(goong[i].six_sin[0]) == "財") { idx[5] = true; L.label106.text = toNum(goong[i].hongNum[0]) + "中"; }
                    if (toSixSin(goong[i].six_sin[1]) == "官" || toSixSin(goong[i].six_sin[1]) == "鬼") { idx[6] = true; L.label105.text = toNum(goong[i].hongNum[1]) + "中"; }
                    if (toSixSin(goong[i].six_sin[0]) == "官" || toSixSin(goong[i].six_sin[0]) == "鬼") { idx[7] = true; L.label104.text = toNum(goong[i].hongNum[0]) + "中"; }
                    if (toSixSin(goong[i].six_sin[1]) == "父") { idx[8] = true; L.label103.text = toNum(goong[i].hongNum[1]) + "中"; }
                    if (toSixSin(goong[i].six_sin[0]) == "父") { idx[9] = true; L.label112.text = toNum(goong[i].hongNum[0]) + "中"; }
                }

                else
                {
                    if (toSixSin(goong[i].six_sin[1]) == "世")
                    {
                        if (idx[0] == true)
                        {
                            L.label86.text = toNum(goong[i].hongNum[1]) + "世";
                            L.label86.fore = "#ff0000";
                        }
                        else
                        {
                            L.label111.text = toNum(goong[i].hongNum[1]) + "世";
                            L.label111.fore = "#ff0000";
                            idx[0] = true;
                        }
                    }

                    if (toSixSin(goong[i].six_sin[1]) == "兄")
                    {
                        if (idx[0] == false)
                        {
                            idx[0] = true;
                            if (goong[i].b_dong[0] == true)
                                L.label111.text = toNum(goong[i].hongNum[1]) + "年";
                            else if (goong[i].b_dong[1] == true)
                                L.label111.text = toNum(goong[i].hongNum[1]) + "月";
                            else if (goong[i].b_dong[2] == true)
                                L.label111.text = toNum(goong[i].hongNum[1]) + "日";
                            else if (goong[i].b_dong[3] == true)
                                L.label111.text = toNum(goong[i].hongNum[1]) + "時";
                            else idx[0] = false;
                        }
                        else if (L.label111.text.includes(toNum(goong[i].hongNum[1]))) {}
                        else if (goong[i].b_dong[0] == true)
                            L.label86.text = toNum(goong[i].hongNum[1]) + "年";
                        else if (goong[i].b_dong[1] == true)
                            L.label86.text = toNum(goong[i].hongNum[1]) + "月";
                        else if (goong[i].b_dong[2] == true)
                            L.label86.text = toNum(goong[i].hongNum[1]) + "日";
                        else if (goong[i].b_dong[3] == true)
                            L.label86.text = toNum(goong[i].hongNum[1]) + "時";
                    }

                    if (toSixSin(goong[i].six_sin[0]) == "兄")
                    {
                        if (idx[1] == false)
                        {
                            idx[1] = true;
                        if (goong[i].b_dong[0] == true)
                            L.label110.text = toNum(goong[i].hongNum[0]) + "年";
                        else if (goong[i].b_dong[1] == true)
                            L.label110.text = toNum(goong[i].hongNum[0]) + "月";
                        else if (goong[i].b_dong[2] == true)
                            L.label110.text = toNum(goong[i].hongNum[0]) + "日";
                        else if (goong[i].b_dong[3] == true)
                            L.label110.text = toNum(goong[i].hongNum[0]) + "時";
                        else idx[1] = false;
                    }
                    else if (L.label110.text.includes(toNum(goong[i].hongNum[0]))) {}
                    else if (goong[i].b_dong[0] == true)
                        L.label85.text = toNum(goong[i].hongNum[0]) + "年";
                    else if (goong[i].b_dong[1] == true)
                        L.label85.text = toNum(goong[i].hongNum[0]) + "月";
                    else if (goong[i].b_dong[2] == true)
                        L.label85.text = toNum(goong[i].hongNum[0]) + "日";
                    else if (goong[i].b_dong[3] == true)
                        L.label85.text = toNum(goong[i].hongNum[0]) + "時";
                    }

                    if (toSixSin(goong[i].six_sin[1]) == "孫")
                    {
                        if (idx[2] == false)
                        {
                            idx[2] = true;
                            if (goong[i].b_dong[0] == true)
                                L.label109.text = toNum(goong[i].hongNum[1]) + "年";
                            else if (goong[i].b_dong[1] == true)
                                L.label109.text = toNum(goong[i].hongNum[1]) + "月";
                            else if (goong[i].b_dong[2] == true)
                                L.label109.text = toNum(goong[i].hongNum[1]) + "日";
                            else if (goong[i].b_dong[3] == true)
                                L.label109.text = toNum(goong[i].hongNum[1]) + "時";
                            else idx[2] = false;
                        }
                        else if (L.label109.text.includes(toNum(goong[i].hongNum[1]))) {}
                        else if (goong[i].b_dong[0] == true)
                            L.label84.text = toNum(goong[i].hongNum[1]) + "年";
                        else if (goong[i].b_dong[1] == true)
                            L.label84.text = toNum(goong[i].hongNum[1]) + "月";
                        else if (goong[i].b_dong[2] == true)
                            L.label84.text = toNum(goong[i].hongNum[1]) + "日";
                        else if (goong[i].b_dong[3] == true)
                            L.label84.text = toNum(goong[i].hongNum[1]) + "時";
                    }

                    if (toSixSin(goong[i].six_sin[0]) == "孫")
                    {
                        if (idx[3] == false)
                        {
                            idx[3] = true;
                            if (goong[i].b_dong[0] == true)
                                L.label108.text = toNum(goong[i].hongNum[0]) + "年";
                            else if (goong[i].b_dong[1] == true)
                                L.label108.text = toNum(goong[i].hongNum[0]) + "月";
                            else if (goong[i].b_dong[2] == true)
                                L.label108.text = toNum(goong[i].hongNum[0]) + "日";
                            else if (goong[i].b_dong[3] == true)
                                L.label108.text = toNum(goong[i].hongNum[0]) + "時";
                            else idx[3] = false;
                        }
                        else if (L.label108.text.includes(toNum(goong[i].hongNum[0]))) {}
                        else if (goong[i].b_dong[0] == true)
                            L.label83.text = toNum(goong[i].hongNum[0]) + "年";
                        else if (goong[i].b_dong[1] == true)
                            L.label83.text = toNum(goong[i].hongNum[0]) + "月";
                        else if (goong[i].b_dong[2] == true)
                            L.label83.text = toNum(goong[i].hongNum[0]) + "日";
                        else if (goong[i].b_dong[3] == true)
                            L.label83.text = toNum(goong[i].hongNum[0]) + "時";
                    }
                    if (toSixSin(goong[i].six_sin[1]) == "財")
                    {
                        if (idx[4] == false)
                        {
                            idx[4] = true;
                            if (goong[i].b_dong[0] == true)
                                L.label107.text = toNum(goong[i].hongNum[1]) + "年";
                            else if (goong[i].b_dong[1] == true)
                                L.label107.text = toNum(goong[i].hongNum[1]) + "月";
                            else if (goong[i].b_dong[2] == true)
                                L.label107.text = toNum(goong[i].hongNum[1]) + "日";
                            else if (goong[i].b_dong[3] == true)
                                L.label107.text = toNum(goong[i].hongNum[1]) + "時";
                            else idx[4] = false;
                        }
                        else if (L.label107.text.includes(toNum(goong[i].hongNum[1]))) {}
                        else if (goong[i].b_dong[0] == true)
                            L.label82.text = toNum(goong[i].hongNum[1]) + "年";
                        else if (goong[i].b_dong[1] == true)
                            L.label82.text = toNum(goong[i].hongNum[1]) + "月";
                        else if (goong[i].b_dong[2] == true)
                            L.label82.text = toNum(goong[i].hongNum[1]) + "日";
                        else if (goong[i].b_dong[3] == true)
                            L.label82.text = toNum(goong[i].hongNum[1]) + "時";
                    }
                    if (toSixSin(goong[i].six_sin[0]) == "財")
                    {
                        if (idx[5] == false)
                        {
                            idx[5] = true;
                            if (goong[i].b_dong[0] == true)
                                L.label106.text = toNum(goong[i].hongNum[0]) + "年";
                            else if (goong[i].b_dong[1] == true)
                                L.label106.text = toNum(goong[i].hongNum[0]) + "月";
                            else if (goong[i].b_dong[2] == true)
                                L.label106.text = toNum(goong[i].hongNum[0]) + "日";
                            else if (goong[i].b_dong[3] == true)
                                L.label106.text = toNum(goong[i].hongNum[0]) + "時";
                            else idx[5] = false;
                        }
                        else if (L.label106.text.includes(toNum(goong[i].hongNum[0]))) {}
                        else if (goong[i].b_dong[0] == true)
                            L.label81.text = toNum(goong[i].hongNum[0]) + "年";
                        else if (goong[i].b_dong[1] == true)
                            L.label81.text = toNum(goong[i].hongNum[0]) + "月";
                        else if (goong[i].b_dong[2] == true)
                            L.label81.text = toNum(goong[i].hongNum[0]) + "日";
                        else if (goong[i].b_dong[3] == true)
                            L.label81.text = toNum(goong[i].hongNum[0]) + "時";
                    }
                    if (toSixSin(goong[i].six_sin[1]) == "官" || toSixSin(goong[i].six_sin[1]) == "鬼")
                    {
                        if (idx[6] == false)
                        {
                            idx[6] = true;
                            if (goong[i].b_dong[0] == true)
                                L.label105.text = toNum(goong[i].hongNum[1]) + "年";
                            else if (goong[i].b_dong[1] == true)
                                L.label105.text = toNum(goong[i].hongNum[1]) + "月";
                            else if (goong[i].b_dong[2] == true)
                                L.label105.text = toNum(goong[i].hongNum[1]) + "日";
                            else if (goong[i].b_dong[3] == true)
                                L.label105.text = toNum(goong[i].hongNum[1]) + "時";
                            else idx[6] = false;
                        }
                        else if (L.label105.text.includes(toNum(goong[i].hongNum[1]))) {}
                        else if (goong[i].b_dong[0] == true)
                            L.label80.text = toNum(goong[i].hongNum[1]) + "年";
                        else if (goong[i].b_dong[1] == true)
                            L.label80.text = toNum(goong[i].hongNum[1]) + "月";
                        else if (goong[i].b_dong[2] == true)
                            L.label80.text = toNum(goong[i].hongNum[1]) + "日";
                        else if (goong[i].b_dong[3] == true)
                            L.label80.text = toNum(goong[i].hongNum[1]) + "時";
                    }
                    if (toSixSin(goong[i].six_sin[0]) == "官" || toSixSin(goong[i].six_sin[0]) == "鬼")
                    {
                        if (idx[7] == false)
                        {
                            idx[7] = true;
                            if (goong[i].b_dong[0] == true)
                                L.label104.text = toNum(goong[i].hongNum[0]) + "年";
                            else if (goong[i].b_dong[1] == true)
                                L.label104.text = toNum(goong[i].hongNum[0]) + "月";
                            else if (goong[i].b_dong[2] == true)
                                L.label104.text = toNum(goong[i].hongNum[0]) + "日";
                            else if (goong[i].b_dong[3] == true)
                                L.label104.text = toNum(goong[i].hongNum[0]) + "時";
                            else idx[7] = false;
                        }
                        else if (L.label104.text.includes(toNum(goong[i].hongNum[0]))) {}
                        else if (goong[i].b_dong[0] == true)
                            L.label79.text = toNum(goong[i].hongNum[0]) + "年";
                        else if (goong[i].b_dong[1] == true)
                            L.label79.text = toNum(goong[i].hongNum[0]) + "月";
                        else if (goong[i].b_dong[2] == true)
                            L.label79.text = toNum(goong[i].hongNum[0]) + "日";
                        else if (goong[i].b_dong[3] == true)
                            L.label79.text = toNum(goong[i].hongNum[0]) + "時";
                    }
                    if (toSixSin(goong[i].six_sin[1]) == "父")
                    {
                        if (idx[8] == false)
                        {
                            idx[8] = true;
                            if (goong[i].b_dong[0] == true)
                                L.label103.text = toNum(goong[i].hongNum[1]) + "年";
                            else if (goong[i].b_dong[1] == true)
                                L.label103.text = toNum(goong[i].hongNum[1]) + "月";
                            else if (goong[i].b_dong[2] == true)
                                L.label103.text = toNum(goong[i].hongNum[1]) + "日";
                            else if (goong[i].b_dong[3] == true)
                                L.label103.text = toNum(goong[i].hongNum[1]) + "時";
                            else idx[8] = false;
                        }
                        else if (L.label103.text.includes(toNum(goong[i].hongNum[1]))) {}
                        else if (goong[i].b_dong[0] == true)
                            L.label78.text = toNum(goong[i].hongNum[1]) + "年";
                        else if (goong[i].b_dong[1] == true)
                            L.label78.text = toNum(goong[i].hongNum[1]) + "月";
                        else if (goong[i].b_dong[2] == true)
                            L.label78.text = toNum(goong[i].hongNum[1]) + "日";
                        else if (goong[i].b_dong[3] == true)
                            L.label78.text = toNum(goong[i].hongNum[1]) + "時";
                    }
                    if (toSixSin(goong[i].six_sin[0]) == "父")
                    {
                        if (idx[9] == false)
                        {
                            idx[9] = true;
                            if (goong[i].b_dong[0] == true)
                                L.label112.text = toNum(goong[i].hongNum[0]) + "年";
                            else if (goong[i].b_dong[1] == true)
                                L.label112.text = toNum(goong[i].hongNum[0]) + "月";
                            else if (goong[i].b_dong[2] == true)
                                L.label112.text = toNum(goong[i].hongNum[0]) + "日";
                            else if (goong[i].b_dong[3] == true)
                                L.label112.text = toNum(goong[i].hongNum[0]) + "時";
                            else idx[9] = false;
                        }
                        else if (L.label112.text.includes(toNum(goong[i].hongNum[0]))) {}
                        else if (goong[i].b_dong[0] == true)
                            L.label87.text = toNum(goong[i].hongNum[0]) + "年";
                        else if (goong[i].b_dong[1] == true)
                            L.label87.text = toNum(goong[i].hongNum[0]) + "月";
                        else if (goong[i].b_dong[2] == true)
                            L.label87.text = toNum(goong[i].hongNum[0]) + "日";
                        else if (goong[i].b_dong[3] == true)
                            L.label87.text = toNum(goong[i].hongNum[0]) + "時";

                    }
                }
            }

            for (i = 0; i < 9 && goong[i].b_dong[2] !== true; i++) ;
            for (j = 0; j < 10 && goong[i].hongNum[1] != t[j]; j++) ;
            L.label102.text = toOhaeng(Math.trunc(j / 2));
            L.label101.text = toOhaeng((Math.trunc(j / 2) + 1) % 5);
            L.label100.text = toOhaeng((Math.trunc(j / 2) + 2) % 5);
            L.label90.text = toOhaeng((Math.trunc(j / 2) + 3) % 5);
            L.label89.text = toOhaeng((Math.trunc(j / 2) + 4) % 5);

            S.ringLayout = true;

}

/** 단2 고리 위 라벨 위치: [라벨, 각도(도), 반지름(그림 픽셀)] — 그림 속 원 중심은 (177, 153) */
export const RING_CENTER = { x: 177, y: 153 };
export const RING: [string, number, number][] = [
  ["label111", 346.7, 62.0],
  ["label110", 346.7, 99.8],
  ["label86", 10.8, 61.8],
  ["label85", 10.8, 100.3],
  ["label109", 58.8, 62.8],
  ["label108", 58.8, 103.0],
  ["label84", 82.7, 63.8],
  ["label83", 82.7, 104.3],
  ["label107", 131.0, 61.5],
  ["label106", 131.0, 102.8],
  ["label82", 155.5, 60.3],
  ["label81", 155.5, 101.0],
  ["label105", 204.3, 59.8],
  ["label104", 204.3, 100.5],
  ["label80", 228.7, 60.8],
  ["label79", 228.7, 101.5],
  ["label103", 276.2, 62.5],
  ["label112", 276.2, 103.0],
  ["label78", 299.3, 62.0],
  ["label87", 299.3, 102.0],
];
