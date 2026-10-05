// 정품키 검증용 공개키. 짝이 되는 개인키는 키를 발급하는 사람의 PC 에만 있다. (legacy/tools/keygen/README.md)
// 공개키는 비밀이 아니므로 저장소에 들어 있어도 된다. 이 값을 바꾸면 예전에 발급한 모든 키가 무효가 된다.
import type { PublicJwk } from "./license";

export const PUBLIC_KEY: PublicJwk = {
  kty: "EC",
  crv: "P-256",
  x: "ZYnXeZlAWzIY0ZjnYFuBSxKdiaxuQtLrfcp8AA54aV0",
  y: "U6fCwLzGQGrq4U-bqewEFTKNp_DqQISyfcl7Mm7JgrY",
};
