// 통기도 계산 결과 모델 (DOM 없음). 라벨 로직은 원본 C# 에서 자동 변환한 tongi*.gen.ts 가 하고,
// 여기서는 라벨 초기값을 준비하고 단2 고리 위 라벨의 위치를 계산한다.
// 기본 폼과 신수운 폼은 그림 상자 크기와 라벨 배치가 달라서 두 가지(variant)를 따로 둔다.
import { Goong } from "../engine/index";
import { LABELS, PICTURE_BOX } from "./tongiLabels.gen";
import { LABELSSinsoo, PICTURE_BOXSinsoo } from "./tongiLabelsSinsoo.gen";
import type { LabelInit } from "./tongiLabels.gen";
import { showTongGido1, showTongGido2, LabelMap, TongiState, RING, RING_CENTER } from "./tongi.gen";
import { showTongGido1Sinsoo, showTongGido2Sinsoo, RINGSinsoo, RING_CENTERSinsoo } from "./tongiSinsoo.gen";

export type { LabelMap, TongiState };

/** 그림 크기 (PictureBox 가 Zoom 으로 그리는 두 그림) */
export const IMG1 = { w: 355, h: 305 };   // 단1
export const IMG2 = { w: 355, h: 293 };   // 단2

export type Mode = 1 | 2;

export interface Variant {
  name: "basic" | "sinsoo";
  labels: LabelInit[];
  box: { x: number; y: number; w: number; h: number };
  show1: (g: Goong[], L: LabelMap, S: TongiState) => void;
  show2: (g: Goong[], L: LabelMap, S: TongiState) => void;
  ring: [string, number, number][];
  ringCenter: { x: number; y: number };
}

export const BASIC: Variant = {
  name: "basic", labels: LABELS, box: PICTURE_BOX, show1: showTongGido1, show2: showTongGido2, ring: RING, ringCenter: RING_CENTER,
};
export const SINSOO: Variant = {
  name: "sinsoo", labels: LABELSSinsoo, box: PICTURE_BOXSinsoo, show1: showTongGido1Sinsoo, show2: showTongGido2Sinsoo,
  ring: RINGSinsoo, ringCenter: RING_CENTERSinsoo,
};

/** 디자이너 초기값으로 된 라벨 상태 (폼을 처음 연 직후와 같다) */
export function initialLabels(v: Variant = BASIC): LabelMap {
  const m: LabelMap = {};
  for (const l of v.labels) m[l.name] = { text: l.text, visible: l.visible, fore: l.fore, back: l.back };
  return m;
}

export interface TongiResult {
  mode: Mode;
  labels: LabelMap;
  state: TongiState;
  /** 그림 상자 안에서의 각 라벨 위치. 고리 라벨은 중심 기준(center=true), 나머지는 왼쪽 위 기준 */
  pos: Record<string, { x: number; y: number; center: boolean }>;
}

/** Zoom 으로 그려진 그림이 상자 안에서 차지하는 배율과 시작 위치 */
export function zoomFit(img: { w: number; h: number }, v: Variant = BASIC): { s: number; ox: number; oy: number } {
  const s = Math.min(v.box.w / img.w, v.box.h / img.h);
  return { s, ox: (v.box.w - img.w * s) / 2, oy: (v.box.h - img.h * s) / 2 };
}

export function computeTongi(goong: Goong[], mode: Mode, v: Variant = BASIC, labels: LabelMap = initialLabels(v)): TongiResult {
  const state: TongiState = { pictureBox1: true, pictureBox3: false, centerColor: "", ringLayout: false };
  if (mode === 1) v.show1(goong, labels, state);
  else v.show2(goong, labels, state);

  const pos: TongiResult["pos"] = {};
  for (const l of v.labels) pos[l.name] = { x: l.x - v.box.x, y: l.y - v.box.y, center: false };

  if (state.ringLayout) {   // 단2: 고리 위 라벨을 각도/반지름으로 배치 (원본 LayoutTongGidoLabels)
    const z = zoomFit(IMG2, v);
    const cx = z.ox + v.ringCenter.x * z.s, cy = z.oy + v.ringCenter.y * z.s;
    for (const [name, angle, radius] of v.ring) {
      const t = (angle * Math.PI) / 180;
      pos[name] = { x: cx + radius * z.s * Math.sin(t), y: cy - radius * z.s * Math.cos(t), center: true };
    }
  }
  return { mode, labels, state, pos };
}
