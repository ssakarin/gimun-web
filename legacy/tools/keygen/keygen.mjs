// 정품키 발급 도구 (서버 없이 이 PC 에서만 쓴다)
//
//   node keygen.mjs init                                  처음 한 번: 개인키를 만들고 앱에 넣을 공개키를 출력
//   node keygen.mjs issue --name "홍길동" [--expires 2027-12-31]   정품키 발급 (--expires 를 생략하면 기한 없음)
//   node keygen.mjs verify <키>                           키가 맞는지 확인
//   node keygen.mjs list                                  지금까지 발급한 키 목록
//
// 개인키는 기본적으로 %USERPROFILE%\.gimun-license\private.pem 에 저장된다. (저장소 밖이므로 커밋되지 않음)
// 폴더를 바꾸려면 --dir <폴더> 또는 환경변수 GIMUN_LICENSE_DIR. 개인키를 잃어버리면 새 키를 발급할 수 없고,
// 새로 만들면 앱에 들어 있는 공개키를 바꿔서 다시 배포해야 하며 예전 키는 모두 무효가 된다. 반드시 백업하세요.
import { generateKeyPairSync, createPrivateKey, createPublicKey, sign, verify } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync, appendFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const PREFIX = "GMR1-";
const args = process.argv.slice(2);
const cmd = args[0];
const opt = (name) => { const i = args.indexOf("--" + name); return i >= 0 ? args[i + 1] : undefined; };
const dir = opt("dir") ?? process.env.GIMUN_LICENSE_DIR ?? join(homedir(), ".gimun-license");
const privPath = join(dir, "private.pem");
const logPath = join(dir, "issued.csv");

const b64url = (buf) => Buffer.from(buf).toString("base64url");

function loadPrivate() {
  if (!existsSync(privPath)) {
    console.error("개인키가 없습니다: " + privPath + "\n먼저 'node keygen.mjs init' 을 실행하세요.");
    process.exit(1);
  }
  return createPrivateKey(readFileSync(privPath));
}

function publicJwk(privateKey) {
  const j = createPublicKey(privateKey).export({ format: "jwk" });
  return { kty: j.kty, crv: j.crv, x: j.x, y: j.y };
}

function makeKey(privateKey, name, expires) {
  const payload = { v: 1, n: name };
  if (expires) payload.e = expires;
  const bytes = Buffer.from(JSON.stringify(payload), "utf-8");
  // ieee-p1363 = WebCrypto 가 쓰는 r||s 64바이트 형식
  const sig = sign("sha256", bytes, { key: privateKey, dsaEncoding: "ieee-p1363" });
  return PREFIX + b64url(bytes) + "." + b64url(sig);
}

if (cmd === "init") {
  if (existsSync(privPath)) {
    console.error("이미 개인키가 있습니다: " + privPath + "\n(덮어쓰면 예전에 발급한 모든 키가 무효가 되므로 중단합니다)");
    process.exit(1);
  }
  mkdirSync(dir, { recursive: true });
  const { privateKey } = generateKeyPairSync("ec", { namedCurve: "P-256" });
  writeFileSync(privPath, privateKey.export({ format: "pem", type: "pkcs8" }), { mode: 0o600 });
  console.log("개인키를 만들었습니다: " + privPath);
  console.log("\n아래 공개키를 src/license/publicKey.ts 에 넣으세요:\n");
  console.log("export const PUBLIC_KEY: PublicJwk = " + JSON.stringify(publicJwk(privateKey)) + ";");
} else if (cmd === "issue") {
  const name = opt("name");
  const expires = opt("expires");
  if (!name) { console.error('사용법: node keygen.mjs issue --name "홍길동" [--expires 2027-12-31]'); process.exit(1); }
  if (expires && !/^\d{4}-\d{2}-\d{2}$/.test(expires)) { console.error("--expires 는 YYYY-MM-DD 형식이어야 합니다"); process.exit(1); }
  const key = makeKey(loadPrivate(), name, expires);
  const today = new Date().toISOString().slice(0, 10);
  appendFileSync(logPath, [name.replace(/,/g, "."), expires ?? "", today, key].join(",") + "\n");
  console.log(key);
  console.error("\n발급 기록: " + logPath);
} else if (cmd === "verify") {
  const key = (args[1] ?? "").replace(/\s+/g, "");
  const pub = createPublicKey(loadPrivate());
  const [p, s] = key.replace(PREFIX, "").split(".");
  const ok = key.startsWith(PREFIX) && p && s && verify("sha256", Buffer.from(p, "base64url"), { key: pub, dsaEncoding: "ieee-p1363" }, Buffer.from(s, "base64url"));
  if (ok) console.log("올바른 키입니다: " + Buffer.from(p, "base64url").toString("utf-8"));
  else { console.log("올바르지 않은 키입니다"); process.exit(2); }
} else if (cmd === "list") {
  console.log(existsSync(logPath) ? readFileSync(logPath, "utf-8") : "(아직 발급한 키가 없습니다)");
} else {
  console.log("사용법: init | issue --name <이름> [--expires YYYY-MM-DD] | verify <키> | list");
}
