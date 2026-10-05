import { describe, it, expect, beforeAll } from "vitest";
import {
  addMonths, checkTrial, verifyKey, currentState, storeKey, normalizeKey, bytesToB64url, describeState,
  KEY_PREFIX, PublicJwk, KeyValueStorage,
} from "../src/license/license";

const mem = (): KeyValueStorage & { map: Map<string, string> } => {
  const map = new Map<string, string>();
  return { map, getItem: (k) => map.get(k) ?? null, setItem: (k, v) => void map.set(k, v) };
};

// 시험용 키 쌍: 실제 개인키는 쓰지 않는다
let pub: PublicJwk;
let priv: CryptoKey;
beforeAll(async () => {
  const kp = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
  pub = (await crypto.subtle.exportKey("jwk", kp.publicKey)) as unknown as PublicJwk;
  priv = kp.privateKey;
});

async function issue(payload: object, key: CryptoKey = priv): Promise<string> {
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  const sig = new Uint8Array(await crypto.subtle.sign({ name: "ECDSA", hash: "SHA-256" }, key, bytes));
  return KEY_PREFIX + bytesToB64url(bytes) + "." + bytesToB64url(sig);
}

describe("개월 더하기 (C# AddMonths 와 같다)", () => {
  it("일반", () => expect(addMonths("2026-10-05", 5)).toBe("2027-03-05"));
  it("해를 넘김", () => expect(addMonths("2026-12-15", 5)).toBe("2027-05-15"));
  it("그 날짜가 없는 달이면 말일", () => {
    expect(addMonths("2026-10-31", 5)).toBe("2027-03-31");
    expect(addMonths("2026-09-30", 5)).toBe("2027-02-28");
    expect(addMonths("2023-09-30", 5)).toBe("2024-02-29");
  });
});

describe("체험판 (5개월)", () => {
  it("처음 실행하면 시작일을 기록하고 5개월 뒤까지 쓸 수 있다", () => {
    const st = mem();
    const t = checkTrial(st, "2026-10-05");
    expect(t).toMatchObject({ valid: true, expiresOn: "2027-03-05", recorded: true });
    expect(t.daysLeft).toBe(151);
    expect(st.map.size).toBe(1);
  });

  it("만료일 당일까지는 되고 다음 날부터 막힌다", () => {
    const st = mem();
    checkTrial(st, "2026-10-05");
    expect(checkTrial(st, "2027-03-05").valid).toBe(true);
    expect(checkTrial(st, "2027-03-06").valid).toBe(false);
  });

  it("시계를 되감으면 무효", () => {
    const st = mem();
    checkTrial(st, "2026-10-05");
    checkTrial(st, "2026-12-01");
    expect(checkTrial(st, "2026-11-01").valid).toBe(false);
  });

  it("기록이 깨져 있으면 처음부터 다시 시작한다", () => {
    const st = mem();
    st.setItem("gimun.t", "깨진값!!");
    expect(checkTrial(st, "2026-10-05").expiresOn).toBe("2027-03-05");
  });

  it("저장소를 쓸 수 없는 환경에서도 죽지 않는다", () => {
    expect(checkTrial(null, "2026-10-05")).toMatchObject({ valid: true, recorded: false });
    const bad: KeyValueStorage = { getItem: () => { throw new Error("x"); }, setItem: () => { throw new Error("x"); } };
    expect(checkTrial(bad, "2026-10-05").valid).toBe(true);
  });
});

describe("정품키 검증", () => {
  it("정상 키", async () => {
    const k = await issue({ v: 1, n: "홍길동", e: "2027-12-31" });
    expect(await verifyKey(k, pub, "2026-10-05")).toEqual({ ok: true, info: { name: "홍길동", expires: "2027-12-31" } });
  });

  it("기한 없는 키", async () => {
    const k = await issue({ v: 1, n: "무기한" });
    expect(await verifyKey(k, pub, "2099-01-01")).toEqual({ ok: true, info: { name: "무기한", expires: null } });
  });

  it("공백, 줄바꿈이 섞여 붙여넣어져도 된다", async () => {
    const k = await issue({ v: 1, n: "홍길동" });
    const messy = "  " + k.slice(0, 20) + "\n" + k.slice(20, 60) + "\r\n " + k.slice(60) + " ";
    expect((await verifyKey(messy, pub)).ok).toBe(true);
    expect(normalizeKey(messy)).toBe(k);
  });

  it("만료일이 지난 키", async () => {
    const k = await issue({ v: 1, n: "홍길동", e: "2026-01-31" });
    expect(await verifyKey(k, pub, "2026-01-31")).toMatchObject({ ok: true });
    expect(await verifyKey(k, pub, "2026-02-01")).toMatchObject({ ok: false, reason: "expired" });
  });

  it("내용을 바꾸면 서명이 맞지 않는다", async () => {
    const k = await issue({ v: 1, n: "홍길동", e: "2026-12-31" });
    const [p, s] = k.slice(KEY_PREFIX.length).split(".");
    const forged = KEY_PREFIX + bytesToB64url(new TextEncoder().encode(JSON.stringify({ v: 1, n: "홍길동", e: "2099-12-31" }))) + "." + s;
    expect(await verifyKey(forged, pub)).toMatchObject({ ok: false, reason: "signature" });
    void p;
  });

  it("다른 개인키로 만든 키는 거부", async () => {
    const other = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
    const k = await issue({ v: 1, n: "도둑" }, other.privateKey);
    expect(await verifyKey(k, pub)).toMatchObject({ ok: false, reason: "signature" });
  });

  it("형식이 틀린 문자열", async () => {
    for (const bad of ["", "abc", "GMR1-", "GMR1-abc", "GMR1-a.b", "GMR2-" + "x".repeat(50)])
      expect(await verifyKey(bad, pub)).toMatchObject({ ok: false, reason: "format" });
  });
});

describe("전체 상태", () => {
  it("체험 중 -> 정품키 등록하면 정품", async () => {
    const st = mem();
    expect((await currentState(st, pub, "2026-10-05")).kind).toBe("trial");
    storeKey(st, await issue({ v: 1, n: "홍길동" }));
    const s = await currentState(st, pub, "2026-10-06");
    expect(s).toMatchObject({ kind: "licensed", info: { name: "홍길동" } });
    expect(describeState(s)).toBe("정품 · 홍길동");
  });

  it("체험 5개월이 지나고 정품키가 없으면 만료", async () => {
    const st = mem();
    await currentState(st, pub, "2026-10-05");
    const s = await currentState(st, pub, "2027-03-06");
    expect(s).toMatchObject({ kind: "expired", expiredOn: "2027-03-05" });
    expect(describeState(s)).toBe("사용기한이 만료되었습니다");
  });

  it("정품키가 만료되고 체험도 끝났으면 만료(키 만료 표시)", async () => {
    const st = mem();
    await currentState(st, pub, "2026-01-01");
    storeKey(st, await issue({ v: 1, n: "홍길동", e: "2026-06-30" }));
    expect(await currentState(st, pub, "2026-07-01")).toMatchObject({ kind: "expired", keyProblem: "expired" });
  });

  it("체험이 끝났어도 유효한 정품키가 있으면 정품", async () => {
    const st = mem();
    await currentState(st, pub, "2026-01-01");
    storeKey(st, await issue({ v: 1, n: "홍길동", e: "2030-12-31" }));
    expect((await currentState(st, pub, "2027-03-06")).kind).toBe("licensed");
  });
});
