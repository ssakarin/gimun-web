// 통기도 계산 결과 모델 (DOM 없음). 라벨 로직은 원본 C# 에서 자동 변환한 tongi.gen.ts 가 하고,
// 여기서는 라벨 초기값을 준비하고 단2 고리 위 라벨의 위치를 계산한다.
import { Goong } from "../engine/index";
import { LABELS, PICTURE_BOX } from "./tongiLabels.gen";
import { showTongGido1, showTongGido2, LabelMap, TongiState, RING, RING_CENTER } from "./tongi.gen";

export type { LabelMap, TongiState };
export { PICTURE_BOX };

/** 그림 크기 (원본 PictureBox 가 Zoom 으로 그리는 두 그림) */
export const IMG1 = { w: 355, h: 305 };   // 단1
export const IMG2 = { w: 355, h: 293 };   // 단2

export type Mode = 1 | 2;

/** 디자이너 초기값으로 된 라벨 상태 (폼을 처음 연 직후와 같다) */
export function initialLabels(): LabelMap {
  const m: LabelMap = {};
  for (const l of LABELS) m[l.name] = { text: l.text, visible: l.visible, fore: l.fore, back: l.back };
  return m;
}

export interface TongiResult {
  mode: Mode;
  labels: LabelMap;
  state: TongiState;
  /** 컨테이너(406x366) 안에서의 각 라벨 위치. 고리 라벨은 중심 기준(center=true), 나머지는 왼쪽 위 기준 */
  pos: Record<string, { x: number; y: number; center: boolean }>;
}

/** Zoom 으로 그려진 그림이 상자 안에서 차지하는 배율과 시작 위치 */
export function zoomFit(img: { w: number; h: number }): { s: number; ox: number; oy: number } {
  const s = Math.min(PICTURE_BOX.w / img.w, PICTURE_BOX.h / img.h);
  return { s, ox: (PICTURE_BOX.w - img.w * s) / 2, oy: (PICTURE_BOX.h - img.h * s) / 2 };
}

export function computeTongi(goong: Goong[], mode: Mode, labels: LabelMap = initialLabels()): TongiResult {
  const state: TongiState = { pictureBox1: true, pictureBox3: false, centerColor: "", ringLayout: false };
  if (mode === 1) showTongGido1(goong, labels, state);
  else showTongGido2(goong, labels, state);

  const pos: TongiResult["pos"] = {};
  for (const l of LABELS) pos[l.name] = { x: l.x - PICTURE_BOX.x, y: l.y - PICTURE_BOX.y, center: false };

  if (state.ringLayout) {   // 단2: 고리 위 라벨을 각도/반지름으로 배치 (원본 LayoutTongGidoLabels)
    const z = zoomFit(IMG2);
    const cx = z.ox + RING_CENTER.x * z.s, cy = z.oy + RING_CENTER.y * z.s;
    for (const [name, angle, radius] of RING) {
      const t = (angle * Math.PI) / 180;
      pos[name] = { x: cx + radius * z.s * Math.sin(t), y: cy - radius * z.s * Math.cos(t), center: true };
    }
  }
  return { mode, labels, state, pos };
}
