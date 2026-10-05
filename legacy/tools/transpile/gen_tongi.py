# 통기도(단1/단2) 라벨 로직을 C# 에서 TypeScript 로 옮기는 변환기 (일회성 보조 도구)
#   python gen_tongi.py <기본 Form.cs> <기본 Form.Designer.cs> <출력 폴더(gimun-web/src/ui)> [태그]
#   태그를 주면(예: Sinsoo, 신수운 Form 용) 파일/함수 이름 뒤에 태그가 붙고 공통 타입은 tongi.gen.ts 것을 가져다 쓴다.
# 출력:
#   tongi.gen.ts        showTongGido1 / showTongGido2 (라벨 글자, 보임 여부, 색을 계산) + 단2 고리 배치 표(RING)
#   tongiLabels.gen.ts  디자이너에서 뽑은 라벨 초기값(위치, 크기, 글자, 색, 글꼴)
import re, sys

form_cs, designer_cs, outdir = sys.argv[1], sys.argv[2], sys.argv[3]
TAG = sys.argv[4] if len(sys.argv) > 4 else ""
cs = open(form_cs, "rb").read().decode("utf-8-sig").replace("\r\n", "\n")
dz = open(designer_cs, "rb").read().decode("utf-8-sig").replace("\r\n", "\n")


def strip_comments(text):
    text = re.sub(r"/\*.*?\*/", "", text, flags=re.S)
    out = []
    for l in text.split("\n"):
        res = []
        instr = False
        k = 0
        while k < len(l):
            c = l[k]
            if c == '"' and (k == 0 or l[k - 1] != "\\"):
                instr = not instr
            if not instr and l[k:k + 2] == "//":
                break
            res.append(c)
            k += 1
        out.append("".join(res).rstrip())
    return "\n".join(out)


cs_clean = None


def method_body(name_sig):
    global cs_clean
    if cs_clean is None:
        cs_clean = strip_comments(cs)
    a = cs_clean.index(name_sig)
    i = cs_clean.index("{", a)
    depth = 0
    j = i
    instr = False
    while True:
        c = cs_clean[j]
        if c == '"' and cs_clean[j - 1] != "\\":
            instr = not instr
        if not instr:
            if c == "{":
                depth += 1
            elif c == "}":
                depth -= 1
                if depth == 0:
                    return cs_clean[i + 1:j]
        j += 1


used = set()


def convert(body, fname):
    body = strip_comments(body)
    body = re.sub(r"string\[,\] labelname\d?\s*=.*?\}\s*\}\s*;", "", body, flags=re.S)
    body = body.replace("this.Refresh();", "")
    body = re.sub(r"pictureBox3\.SendToBack\(\);", "", body)
    body = body.replace("LayoutTongGidoLabels();", "S.ringLayout = true;")
    body = re.sub(r"pictureBox(\d)\.Visible = (true|false);", r"S.pictureBox\1 = \2;", body)
    body = body.replace("myBrush = new SolidBrush(myColor);", "S.centerColor = myColor;")
    body = body.replace("Color myColor;", 'let myColor = "";')
    body = re.sub(r"Color\.FromArgb\((\d+),\s*(\d+),\s*(\d+)\)", r"rgb(\1, \2, \3)", body)
    body = body.replace("Color.Red", '"#ff0000"').replace("Color.Black", '"#000000"').replace("Color.White", '"#ffffff"')
    for n in re.findall(r"\blabel(\d+)\b", body):
        used.add(n)
    body = re.sub(r"\blabel(\d+)\.Text\.Contains\(", r"L.label\1.text.includes(", body)
    body = re.sub(r"\blabel(\d+)\.Text\b", r"L.label\1.text", body)
    body = re.sub(r"\blabel(\d+)\.Visible\b", r"L.label\1.visible", body)
    body = re.sub(r"\blabel(\d+)\.BackColor\b", r"L.label\1.back", body)
    body = re.sub(r"\blabel(\d+)\.ForeColor\b", r"L.label\1.fore", body)
    body = body.replace("int i, j;", "let i = 0, j = 0;")
    body = re.sub(r"\bbool\[\] idx = \{([^}]*)\};", r"const idx = [\1];", body)
    body = re.sub(r"\bint\[\] t = \{([^}]*)\};", r"const t = [\1];", body)
    # 이미 같은 숫자가 있으면 아무것도 안 하는 분기: `else if (조건) ;` -> `else if (조건) {}`
    body = re.sub(r"(else if \(L\.label\d+\.text\.includes\([^\n]*\)\))\s*;", r"\1 {}", body)
    body = body.replace("j / 2", "Math.trunc(j / 2)")
    body = body.replace(" != true", " !== true")
    # 빈 줄 정리
    body = re.sub(r"\n\s*\n\s*\n+", "\n\n", body)
    return body


b1 = convert(method_body("public void showTongGido(Goong[] goong)"), "1")
b2 = convert(method_body("public void showTongGido_1(Goong[] goong)"), "2")

# 단2 고리 라벨 배치표 (LayoutTongGidoLabels)
lay = strip_comments(method_body("private void LayoutTongGidoLabels()"))
ring = re.findall(r"PlaceRingLabel\(label(\d+),\s*([\d.]+)f,\s*([\d.]+)f \* s, cx, cy\);", lay)
cxy = re.search(r"\+ (\d+)f \* s;\s*// 그림 안 원 중심.*?\n.*?float cy = .*?\+ (\d+)f \* s;", lay + "\n", re.S)
cx0 = re.search(r"float cx = [^;]*\+ ([\d.]+)f \* s;", lay).group(1)
cy0 = re.search(r"float cy = [^;]*\+ ([\d.]+)f \* s;", lay).group(1)
for n, _, _ in ring:
    used.add(n)

if TAG:
    head = '''// 자동 생성: tools/transpile/gen_tongi.py (원본 C# showTongGido / showTongGido_1 를 옮긴 것). 직접 고치지 마세요.
import { Goong, toNum, toSixSin, toOhaeng } from "../engine/index";
import type { LabelMap, TongiState } from "./tongi.gen";

const rgb = (r: number, g: number, b: number): string =>
  "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");

'''
else:
    head = '''// 자동 생성: tools/transpile/gen_tongi.py (원본 C# showTongGido / showTongGido_1 를 옮긴 것). 직접 고치지 마세요.
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

'''

out = head
out += "/** 단1 통기도 (원 그림 + 6친 라벨) */\nexport function showTongGido1" + TAG + "(goong: Goong[], L: LabelMap, S: TongiState): void {" + b1 + "}\n\n"
out += "/** 단2 통기도 (오각 그림 위 고리 라벨) */\nexport function showTongGido2" + TAG + "(goong: Goong[], L: LabelMap, S: TongiState): void {" + b2 + "}\n\n"
out += "/** 단2 고리 위 라벨 위치: [라벨, 각도(도), 반지름(그림 픽셀)] — 그림 속 원 중심은 (%s, %s) */\n" % (cx0, cy0)
out += "export const RING_CENTER" + TAG + " = { x: %s, y: %s };\n" % (cx0, cy0)
out += "export const RING" + TAG + ": [string, number, number][] = [\n" + "".join('  ["label%s", %s, %s],\n' % r for r in ring) + "];\n"
open(outdir + "/tongi" + TAG + ".gen.ts", "w", encoding="utf-8").write(out)

# ---- 라벨 초기값 (디자이너)
def color(expr, default):
    if expr is None:
        return default
    m = re.search(r"FromArgb\(\(\(int\)\(\(\(byte\)\((\d+)\)\)\)\), \(\(int\)\(\(\(byte\)\((\d+)\)\)\)\), \(\(int\)\(\(\(byte\)\((\d+)\)\)\)\)", expr)
    if m:
        return "#%02x%02x%02x" % tuple(int(x) for x in m.groups())
    table = {"White": "#ffffff", "Black": "#000000", "Red": "#ff0000", "Control": "#f0f0f0", "ControlText": "#000000",
             "Transparent": "#f0f0f0", "Wheat": "#f5deb3", "LightGray": "#d3d3d3", "Pink": "#ffc0cb", "LightGreen": "#90ee90",
             "Gray": "#808080", "Window": "#ffffff", "Blue": "#0000ff"}
    m = re.search(r"\.(\w+)$", expr.strip())
    if m and m.group(1) in table:
        return table[m.group(1)]
    raise Exception("unknown color " + expr)


rows = []
for n in sorted(used, key=int):
    props = dict(re.findall(r"this\.label%s\.(\w+) = ([^;]*);" % n, dz))
    loc = re.search(r"Point\((\d+), (\d+)\)", props.get("Location", "Point(0, 0)"))
    siz = re.search(r"Size\((\d+), (\d+)\)", props.get("Size", "Size(0, 0)"))
    fnt = props.get("Font", "")
    fs = re.search(r"Font\(\"[^\"]*\", ([\d.]+)F", fnt)
    bold = "Bold" in fnt
    text = re.search(r'"(.*)"', props.get("Text", '""'), re.S)
    rows.append({
        "name": "label" + n, "x": int(loc.group(1)), "y": int(loc.group(2)), "w": int(siz.group(1)), "h": int(siz.group(2)),
        "text": text.group(1) if text else "", "visible": props.get("Visible", "true") != "false",
        "fore": color(props.get("ForeColor"), "#000000"), "back": color(props.get("BackColor"), "#f0f0f0"),
        "fontSize": float(fs.group(1)) if fs else 9.75, "bold": bold,
        "border": "FixedSingle" in props.get("BorderStyle", ""),
    })

pb = {}
for n in ("1", "3"):
    props = dict(re.findall(r"this\.pictureBox%s\.(\w+) = ([^;]*);" % n, dz))
    loc = re.search(r"Point\((\d+), (\d+)\)", props["Location"]); siz = re.search(r"Size\((\d+), (\d+)\)", props["Size"])
    pb[n] = (int(loc.group(1)), int(loc.group(2)), int(siz.group(1)), int(siz.group(2)))

import json
lab = "// 자동 생성: tools/transpile/gen_tongi.py — 디자이너(기본 Form.Designer.cs)에서 뽑은 통기도 라벨 초기값\n"
LABEL_INIT = "export interface LabelInit { name: string; x: number; y: number; w: number; h: number; text: string; visible: boolean; fore: string; back: string; fontSize: number; bold: boolean; border: boolean }\n"
lab += ('import type { LabelInit } from "./tongiLabels.gen";\n' if TAG else LABEL_INIT)
lab += "/** 그림 상자(PictureBox) 위치/크기. 라벨 좌표는 폼 전체 기준이라 이 위치를 빼서 쓴다 */\n"
lab += "export const PICTURE_BOX" + TAG + " = { x: %d, y: %d, w: %d, h: %d };\n" % pb["1"]
lab += "export const LABELS" + TAG + ": LabelInit[] = " + json.dumps(rows, ensure_ascii=False, indent=1) + ";\n"
open(outdir + "/tongiLabels" + TAG + ".gen.ts", "w", encoding="utf-8").write(lab)
print("labels:", len(rows), "ring:", len(ring), "pb:", pb)
