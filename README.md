# gimun-web

기문둔갑(奇門遁甲) 사주 프로그램의 웹/앱 버전입니다. C# WinForms 프로그램
([ssakarin/saju](https://github.com/ssakarin/saju))의 계산 엔진을 TypeScript 로 옮긴 것이며,
앞으로 PWA(웹, Windows, 안드로이드)로 만들어 갑니다.

## 현재 상태
- `src/engine/` : 계산 엔진 이식 완료
- `src/ui/`, `src/main.ts` : 최소 화면 (입력 → 사주 4주, 10년 대운, 9궁). 사주 직접 입력, 저장 목록(CSV), 통기도(단1/단2), 인쇄/PNG 저장, 신수운(행년궁, 年局·月局·日局·時局), PWA(설치 가능, 오프라인 동작)
- 모든 계산 결과가 원본 C# 엔진과 같은지 `test/golden/` 의 정답지로 자동 검증

## 실행

```bash
npm install
npm run dev        # 개발 서버 (브라우저에서 http://localhost:5173)
npm test           # 엔진 테스트 (C# 정답지와 비교)
npm run typecheck  # 타입 검사
npm run build      # 배포용 빌드 (dist/). 상대 경로라 어느 주소에 올려도 동작
npm run preview    # 빌드 결과 확인 (http://localhost:4173) - 앱 설치/오프라인 동작은 이쪽에서 확인
```

## 구조

| 경로 | 설명 |
|---|---|
| `src/engine/engine.ts` | 진입 함수: `calculate`, `calculateLunar`, `findBirthDates`, `setMonthDays`, `calcHyear` |
| `src/engine/rules.ts` | 계산 규칙 (C# 에서 자동 변환한 파일) |
| `src/engine/calendarRules.ts` | 24절기, 사주 4주, 서머타임 보정 |
| `src/engine/lunar.ts`, `lunarTable.json` | 음력 변환 (.NET `KoreanLunisolarCalendar` 대체 달력표, 1850~2050년) |
| `src/ui/tongi*.ts` | 통기도. 라벨 로직(`tongi.gen.ts`)과 라벨 초기값(`tongiLabels.gen.ts`)은 원본 C# 에서 자동 변환 |
| `src/sinsoo.ts` | 신수운 계산 (원본 신수운 폼의 동작) |
| `src/store.ts` | 저장된 사람 목록 (원본 data.csv 와 같은 형식) |
| `src/engine/datetime.ts` | 시간대 영향을 받지 않는 날짜 도구 (시각은 UTC 밀리초 숫자로 취급) |
| `test/golden/` | C# 엔진이 만든 정답지 JSON |

## 계산 규칙을 고칠 때
`rules.ts` 는 원본 저장소의 `tools/transpile/gen_rules.py` 가 `SajuEngine.Core.cs` 에서 만든 파일입니다.
통기도(`src/ui/*.gen.ts`)는 `tools/transpile/gen_tongi.py` 가 같은 방식으로 만듭니다.
규칙을 바꿀 때는 원본(C#)을 고친 뒤 다시 생성하고, 정답지를 새로 뽑아 이 저장소에 복사하세요.

```
# 원본 저장소(saju)에서
python tools/transpile/gen_rules.py WindowsFormsApp1/SajuEngine.Core.cs <이 저장소>/src/engine/rules.ts tools/transpile/rules_spec.py
tools/EngineDump 를 빌드해서 cases / palja / monthdays / lunar / lunardays 를 다시 생성 -> test/golden/ 로 복사
```

## 이식할 때 주의한 점
- C# `Math.Round` 는 .5 에서 짝수로 반올림합니다 (JS `Math.round` 와 다름).
- 원본의 한자에는 호환 문자(예: 立 `U+F9F7`)가 섞여 있어 직접 타이핑하지 않고 원본에서 추출합니다.
- 날짜는 입력한 시계 시각 그대로 계산하며 브라우저 시간대/서머타임의 영향을 받지 않습니다.

## 배포
`npm run build` 로 만든 `dist/` 폴더를 정적 호스팅(GitHub Pages, Netlify 등)에 올리면 됩니다.
HTTPS 주소에서 열면 브라우저(Chrome/Edge)에 "설치" 버튼이 나타나고, Windows 와 안드로이드에서 앱처럼 쓸 수 있습니다.
설치 후에는 인터넷 없이도 계산됩니다. 저장된 사람은 그 기기의 브라우저에만 저장되므로 내보내기(CSV)로 백업하세요.
