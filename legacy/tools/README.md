# 검증 도구 (tools)

기문둔갑 프로그램을 리팩터링/이식할 때 "결과가 그대로인지" 확인하는 도구 모음입니다.
모두 .NET Framework 4.7.2 / Visual Studio 2022 MSBuild 로 빌드합니다.

| 도구 | 용도 |
|---|---|
| `EngineCompare` | **엔진 로직 비교.** 옛 프로그램(exe)의 계산 메서드를 리플렉션으로 옛 버튼 순서 그대로 호출한 결과와 새 `SajuEngine` 결과를 약 10만 건 비교한다. 화면을 쓰지 않아 1분 안에 끝난다. |
| `GoldenDump` | **화면 연결 비교.** 폼을 실제로 띄워 버튼을 누르고, 모든 컨트롤의 글자/색과 계산 필드를 파일로 기록한다. 리팩터링 전/후 exe 로 각각 돌려 결과 파일을 비교한다. 느리다(분당 약 100건). |
| `EngineDump` | **TypeScript 이식용 정답지(JSON) 생성.** 엔진 소스를 직접 컴파일해서 입력→출력 정답 데이터, 음력 달력표를 만든다. |

## 사용법

```
# 1) 기준(옛) 프로그램을 따로 빌드해 둔다  (예: git 의 이전 커밋을 체크아웃해서 빌드)
# 2) 엔진 로직 비교
EngineCompare.exe <옛 GimunMyungRi.exe>

# 3) 화면 비교
GoldenDump.exe gen <옛 exe> scen.txt                 # 시나리오 생성(옛 exe 기준)
GoldenDump.exe run <옛 exe> scen.txt old.txt
GoldenDump.exe run <새 exe> scen.txt new.txt         # 같은 시나리오로 새 exe 실행 -> old.txt 와 diff

# 4) 이식용 정답지
EngineDump.exe cases  cases.json 1500
EngineDump.exe palja  palja.json 300
EngineDump.exe lunar  lunar.json
```

## 알려진 의도된 차이
- 기본 폼은 12월 말(약 12/28~31) 출생에서 `toBirthJeolgi` 가 범위 초과로 죽어 "년,월,일,시를 정확히 입력하세요" 가 뜨던 문제가 있었다.
  엔진은 신수운 폼의 `toBirthJeolgi`(다음 해 절기까지 처리) 를 쓰므로 이 경우도 정상 계산된다.
- `get24Terms` 안의 디버그용 `Console.WriteLine` 은 제거했다.
