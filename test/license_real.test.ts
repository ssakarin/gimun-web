// 발급 도구(keygen.mjs)가 만든 키를 앱이 검증하는지 확인한다. 개인키가 있는 PC 에서만 의미가 있어서,
// 환경변수 GIMUN_TEST_KEYS 에 "키1;키2;..." 를 주었을 때만 실행된다.
import { describe, it, expect } from "vitest";
import { verifyKey } from "../src/license/license";
import { PUBLIC_KEY } from "../src/license/publicKey";

const keys = (process.env.GIMUN_TEST_KEYS ?? "").split(";").filter(Boolean);

describe.skipIf(keys.length === 0)("발급 도구가 만든 실제 키", () => {
  it("앱의 공개키로 검증된다", async () => {
    for (const k of keys) {
      const r = await verifyKey(k, PUBLIC_KEY, "2026-10-06");
      expect(r.ok, k.slice(0, 30)).toBe(true);
    }
  });
});
