// 통기도를 화면(DOM)에 그린다. 계산은 tongiModel.ts 가 한다.
import { Goong } from "../engine/index";
import { LABELS } from "./tongiLabels.gen";
import { computeTongi, zoomFit, IMG1, PICTURE_BOX, Mode } from "./tongiModel";
import img1 from "../assets/tongi1.png";
import img2 from "../assets/tongi2.png";

export function renderTongi(host: HTMLElement, goong: Goong[], mode: Mode): void {
  const r = computeTongi(goong, mode);
  host.replaceChildren();

  const stage = document.createElement("div");
  stage.className = "tongi-stage";
  stage.style.width = PICTURE_BOX.w + "px";
  stage.style.height = PICTURE_BOX.h + "px";

  const img = document.createElement("img");
  img.src = mode === 1 ? img1 : img2;
  img.alt = mode === 1 ? "통기도 단1" : "통기도 단2";
  img.className = "tongi-img";
  stage.append(img);

  if (mode === 1 && r.state.centerColor) {   // 단1: 가운데 원을 일간 오행 색으로 채운다
    const z = zoomFit(IMG1);
    const d = 86 * z.s;
    const c = document.createElement("div");
    c.className = "tongi-center";
    c.style.cssText = `left:${z.ox + 124 * z.s}px;top:${z.oy + 111 * z.s}px;width:${d}px;height:${d}px;background:${r.state.centerColor}`;
    stage.append(c);
  }

  for (const l of LABELS) {
    const st = r.labels[l.name];
    if (!st.visible) continue;
    const p = r.pos[l.name];
    const e = document.createElement("div");
    e.className = "tongi-label";
    e.textContent = st.text;
    e.style.color = st.fore;
    e.style.background = st.back;
    e.style.fontSize = (l.fontSize * 4) / 3 + "px";
    if (l.bold) e.style.fontWeight = "bold";
    if (l.border) e.style.border = "1px solid #000";
    e.style.minWidth = l.w + "px";
    e.style.height = l.h + "px";
    e.style.left = p.x + "px";
    e.style.top = p.y + "px";
    if (p.center) e.style.transform = "translate(-50%, -50%)";
    stage.append(e);
  }

  // 화면이 좁으면 통째로 줄인다
  const wrap = document.createElement("div");
  wrap.className = "tongi-wrap";
  wrap.append(stage);
  host.append(wrap);
  const fit = () => {
    const k = Math.min(1, host.clientWidth / PICTURE_BOX.w);
    stage.style.transform = `scale(${k})`;
    wrap.style.width = PICTURE_BOX.w * k + "px";
    wrap.style.height = PICTURE_BOX.h * k + "px";
  };
  fit();
  new ResizeObserver(fit).observe(host);
}
