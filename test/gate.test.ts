import { describe, expect, it } from "vitest";
import { decide, GRACE_MS } from "../src/gate";

const now = 1_000_000_000_000;
describe("gate.decide", () => {
  it("온라인 정상", () => expect(decide({ status: 200, active: true }, null, now)).toEqual({ ok: true, offline: false }));
  it("서버가 중단 표시", () => expect(decide({ status: 200, active: false }, now, now)).toEqual({ ok: false, reason: "stopped" }));
  it("주소 사라짐(404)", () => expect(decide({ status: 404 }, now, now)).toEqual({ ok: false, reason: "stopped" }));
  it("오프라인 7일 이내 허용", () => expect(decide(null, now - GRACE_MS + 1000, now)).toEqual({ ok: true, offline: true }));
  it("오프라인 7일 초과 잠금", () => expect(decide(null, now - GRACE_MS - 1, now)).toEqual({ ok: false, reason: "expired" }));
  it("일시 장애(503)는 오프라인 취급", () => expect(decide({ status: 503 }, now - 1000, now)).toEqual({ ok: true, offline: true }));
  it("한 번도 확인 못함", () => expect(decide(null, null, now)).toEqual({ ok: false, reason: "never" }));
  it("시계를 과거로 되돌림", () => expect(decide(null, now + 1000, now)).toEqual({ ok: false, reason: "expired" }));
});
