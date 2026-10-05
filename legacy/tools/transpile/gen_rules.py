# SajuEngine.Core.cs (C#) -> web/src/engine/rules.ts 변환기 (일회성 보조 도구)
# 문법이 거의 같은 메서드 본문을 기계적으로 옮기고, out 인자/goto/정수나눗셈 등은 rules_spec.py 의 PATCHES 로 손본다.
#   python gen_rules.py <SajuEngine.Core.cs> <rules.ts> rules_spec.py
import re, sys, io

SRC = sys.argv[1]
OUT = sys.argv[2]
src = open(SRC, "rb").read().decode("utf-8-sig").replace("\r\n", "\n")
lines = src.split("\n")

sig = re.compile(r"^        public static (\S+) (\w+)\((.*?)\)\s*(//.*)?$")
spans = []
for i, l in enumerate(lines):
    m = sig.match(l)
    if m:
        spans.append((i, m.group(2)))
spans.append((len(lines), "END"))

bodies = {}
for (s, n), (e, _) in zip(spans, spans[1:]):
    depth = 0
    started = False
    end = None
    in_block_comment = False
    for k in range(s + 1, e):
        raw = lines[k]
        # /* */ 주석 안의 중괄호는 무시
        if in_block_comment:
            if "*/" in raw:
                in_block_comment = False
            continue
        if raw.strip().startswith("/*") and "*/" not in raw:
            in_block_comment = True
            continue
        txt = re.sub(r'"(?:[^"\\]|\\.)*"', '""', raw.split("//")[0])
        depth += txt.count("{") - txt.count("}")
        if "{" in txt:
            started = True
        if started and depth == 0:
            end = k
            break
    bodies[n] = (lines[s], lines[s + 1:end + 1])


def convert_arrays(text):
    """타입이 붙은 배열 초기화 { ... } -> [ ... ]"""
    out = []
    i = 0
    pat = re.compile(r"\b(?:int|double|string|String|bool)\[,?\]\s+(\w+)\s*=\s*\{")
    while True:
        m = pat.search(text, i)
        if not m:
            out.append(text[i:])
            break
        out.append(text[i:m.start()])
        out.append("const " + m.group(1) + " = [")
        j = m.end()
        depth = 1
        while depth:
            c = text[j]
            if c == "{":
                depth += 1
                out.append("[")
            elif c == "}":
                depth -= 1
                out.append("]")
            else:
                out.append(c)
            j += 1
        i = j
    return "".join(out)


def strip_comments(text):
    text = re.sub(r"/\*.*?\*/", "", text, flags=re.S)
    res = []
    for l in text.split("\n"):
        out = []
        instr = False
        k = 0
        while k < len(l):
            c = l[k]
            if c == '"' and (k == 0 or l[k - 1] != "\\"):
                instr = not instr
            if not instr and l[k:k + 2] == "//":
                break
            out.append(c)
            k += 1
        res.append("".join(out).rstrip())
    return "\n".join(res)


def convert_body(text):
    text = strip_comments(text)
    text = convert_arrays(text)
    pat2 = re.compile(r"(\w+)\[([^\[\],\n]+?), ([^\[\]\n]+?)\]")
    for _ in range(4):
        text = pat2.sub(r"\1[\2][\3]", text)

    def decl(m):
        ind, typ, rest = m.group(1), m.group(2), m.group(3)
        if "=" not in rest:
            init = {"int": "0", "double": "0", "string": '""', "String": '""', "bool": "false"}[typ]
            names = [x.strip() for x in rest.split(",")]
            return ind + "let " + ", ".join(n + " = " + init for n in names) + ";"
        return ind + "let " + rest + ";"

    text = re.sub(r"^(\s*)(int|double|string|String|bool)\s+([^\n;]*);", decl, text, flags=re.M)
    text = text.replace("for (int ", "for (let ")
    text = text.replace("(int)(", "Math.trunc(")
    text = text.replace(" != true", " !== true").replace(" == true", " === true")
    return text


spec = {}
exec(open(sys.argv[3], encoding="utf-8").read(), spec)
ORDER, TS_SIG, PATCHES, HEADER = spec["ORDER"], spec["TS_SIG"], spec["PATCHES"], spec["HEADER"]

out = io.StringIO()
out.write(HEADER)
for name in ORDER:
    header, body = bodies[name]
    text = convert_body("\n".join(body))
    for old, new in PATCHES.get(name, []):
        if old.startswith("re:"):
            text, n = re.subn(old[3:], new, text)
            if n == 0:
                print("PATCH NOT FOUND in", name, ":", old[:70])
                sys.exit(1)
        else:
            if old not in text:
                print("PATCH NOT FOUND in", name, ":", old[:70])
                sys.exit(1)
            text = text.replace(old, new)
    out.write("export function " + TS_SIG[name] + "\n" + text + "\n\n")
open(OUT, "w", encoding="utf-8").write(out.getvalue())
print("generated", len(ORDER), "functions")
