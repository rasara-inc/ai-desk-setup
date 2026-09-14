# 설치 에이전트 실행 순서

## 1. 짧게 시작하기

“AI와 일할 책상을 만들겠습니다. 먼저 필요한 폴더와 연결을 정하고,
마지막에는 실제 업무 하나를 같이 해 보겠습니다.”라고 안내한다.
필요한 정보만 묶어서 확인한다: 쓰고 싶은 호칭, 거주 도시/시간대, Personal·Business·Work 중
필요한 영역, 메일 서비스(Gmail/Outlook/기타), 우선 해결할 일 하나.
기존 대화에 답이 있으면 다시 묻지 않는다. 답을 기다리는 동안 설치 환경을 확인한다.
개인정보 답변은 업무 폴더에만 기록한다. 이름이 없으면 ‘사용자’로 시작해도 된다.

## 2. 사전 점검과 앱 설치

`sw_vers`, `uname -m`, `command -v node`, `node --version`, `command -v codex`, `codex --version`,
`ls /Applications/Codex.app /Applications/Obsidian.app`으로 필요한 것만 확인한다.
Mac의 지역·시간대는 읽어서 소유자 거주 지역과 대조한다. 시스템 시간대를 몰래 바꾸지 않는다.

필수: Codex 맥 앱(AI 대화 창), Obsidian(문서 창), Node.js 22 이상(현재 지원 LTS 권장), Chrome.
Codex CLI는 진단·MCP 설정을 위해 설치한다. 앱과 CLI는 같은 `~/.codex` 설정을 읽는다.
공식 설치 문서는 manual/01-first-setup.md 참조. VS Code + Codex 확장은 Codex 앱을 설치할 수 없을 때의 예비다.
기존 Homebrew가 있으면 해당 공식 formula/cask의 존재를 `brew info`로 확인하여 필요한 것만 설치한다.
없다면 Homebrew·개발 툴체인을 먼저 깔지 말고 각 공급자의 공식 Mac installer를 이용한다.
서명·개발자 정보를 확인하며 관리자 암호와 OS 승인 버튼은 소유자가 직접 처리한다.
Node 설치 후 현재 터미널에서 경로가 보이지 않으면 PATH를 확인하고 새 터미널에서 확인한다.
Codex 앱은 `https://persistent.oaistatic.com/codex-app-prod/Codex.dmg`, Obsidian은 obsidian.md/download에서 받는다.
서명 게시자가 OpenAI·Obsidian인지 확인한다. Obsidian은 업무용도 무료라 라이선스 구매가 필요 없다.
예비로 VS Code를 쓸 때만 `code --install-extension openai.chatgpt`와 한국어 팩(`MS-CEINTL.vscode-language-pack-ko`)을 설치한다.

Codex 앱에서 소유자 계정으로 ChatGPT 로그인.
Pro 5x 선택·결제·청구통화·세금 확인은 소유자가 한다. 설치자가 자기 계정으로 대신 로그인하지 않는다.
기존 구독이 있으면 현재 요금제를 먼저 확인한다. API 키가 없어도 진행한다.

## 3. 업무 폴더 설치

예: 개인+사업을 선택했을 때, **이 키트 폴더에서**:

```sh
node scripts/setup.mjs --areas personal,business --timezone America/Toronto
node scripts/setup.mjs --areas personal,business --timezone America/Toronto --apply
node scripts/doctor.mjs --target "$HOME/AI Desk"
```

시간대 예시는 Toronto다. Vancouver는 America/Vancouver 등 실제 지역을 사용한다.
개인/사업/직장 중 필요한 것만 생성한다. 대상에 기존 파일이 있으면 충돌 내용을 비교한다.
스크립트는 기존 내용과 ~/.codex/config.toml을 덮어쓰지 않는다.
기존 프로젝트 지침·상위 AGENTS.md가 있으면 사용자 선호와 충돌하는 규칙을 확인한다.
프로젝트 설정은 신뢰된 폴더에서만 적용될 수 있으므로 소유자가 이 폴더를 확인하고 신뢰하도록 안내한다.
AGENTS.md는 행동 지침이며 운영체제의 보안 경계는 아니다.

Memory/profile.md에 호칭·도시·시간대·언어·통화·선택 영역·선제 제안 선호를 기록한다.
사업명은 필요할 때 Business/<English-Name>/에 넣는다. 원본 파일명은 증거 추적을 위해 보존 가능하다.
manual/10-my-guide.md에 그 사람의 첫 3개 업무, 로그인 서비스 이름(비밀번호 제외),
실제 화면에서 확인한 실행 방법, 백업 위치, 재개 방법을 한국어로 작성한다.

## 4. Obsidian을 문서 창, Codex 앱을 대화 창으로 구성

Obsidian을 열고 “Open folder as vault”로 `~/AI Desk`를 선택한다. 새 vault를 만들지 않는다.
설치가 넣은 `.obsidian/app.json`·`appearance.json`·`core-plugins.json`이 적용된다(Live Preview,
표준 마크다운 링크, 새 파일·첨부는 00_inbox, 그래프·백링크·캔버스 꺼짐, 파일 삭제는 Mac 휴지통).
표시 언어는 vault가 아니라 앱 설정이므로 Settings > General > Language에서 한국어를 고른다.
커뮤니티 플러그인·Sync·Publish는 켜지 않는다. Obsidian이 `.obsidian`에 workspace.json 등을
추가로 만드는 것은 정상이며 setup 재실행 시 conflict로 보고되면 기본값과 비교만 한다.

Codex 앱에서 `~/AI Desk`를 프로젝트로 추가하고 폴더 신뢰를 소유자가 확인한다.
화면 배치는 왼쪽 Obsidian(파일 목록 + START-HERE.md), 오른쪽 Codex 앱으로 안내한다.
Codex 앱 메뉴가 영어면 필요한 메뉴 두세 개만 알려 준다. 대화는 한국어다.

VS Code 예비 경로에서는 폴더를 열면 `.vscode/settings.json`이 적용된다. Activity Bar 우클릭으로
Run and Debug, Source Control, Testing만 숨기고 Codex·Explorer·Search는 남긴다.
Settings Sync는 소유자 의사를 확인하기 전 연결하지 않는다.

새 Codex 세션에서 모델 선택기가 **GPT-5.6 Sol / medium**, 권한 표시가 **Full Access**인지 확인한다.
CLI에서는 /model, 앱에서는 현재 모델·추론·권한 선택 UI를 사용한다.
설정 파일만 보고 현재 실행 중인 모델이 바뀌었다고 말하지 않는다.
Astra low 전환 후 간단한 업무로 돌아오면 Sol medium 복귀를 안내한다.

## 5. 연결 도구 설치·검증

manual/07-connections.md의 브라우저·MCP·공식 Computer Use 절차를 수행한다.
문서·PDF·스프레드시트·프레젠테이션 기능도 현재 계정의 공식 플러그인 목록에서 확인하여
제공되는 것만 설치한다. 설치자의 비공개 마켓플레이스·캐시를 복사하지 않는다.
메일은 현재 연결 가능한 공식 앱을 우선하고 필요한 권한만 받는다.
읽기 연결과 삭제/구독해지 권한은 별개이며 도구가 지원하지 않는 작업을 된다고 가정하지 않는다.
MCP 이름이 목록에 보이는 것만으로 완료 처리하지 않는다. 새 세션에서 실제 도구 호출로 확인한다.

## 6. 처음 업무 하나를 끝까지

선택한 업무를 10~15분 크기로 시작한다.
- 이메일: 최근 30일의 제한된 표본을 읽고 중요 메일·광고 후보를 표로 보여준다. 변경은 기준 승인 후.
- 파일: 00_inbox의 연습 파일 3개를 분류하고 원본 위치를 기록한다.
- 문서: 짧은 한국어 메모를 만들고 미리보기·저장·다시 열기를 함께 한다.
메일 전체 삭제·전체 읽음 처리는 첫 실습으로 하지 않는다.
세션 종료를 요청하면 실제 결과, 이어갈 일, 공통기억을 저장하고 새 세션에서 읽어 검증한다.

## 7. 인수 확인 — 이 표를 Memory/setup-status.md에 실제 결과로 갱신

| 확인 항목 | 통과 증거 |
| --- | --- |
| 폴더 | doctor 통과, .git 없음, 선택한 영역만 존재 |
| Obsidian | 소유자가 vault를 다시 열어 한국어 문서 편집·자동 저장을 확인 |
| Codex 앱 | 소유자가 AI Desk 프로젝트를 다시 열어 한국어 대화를 확인 |
| 계정/모델/권한 | 소유자 로그인, 구독 표시와 Sol medium + Full Access 실제 확인 |
| 기억 | 새 세션에서 profile과 이전 인계 내용을 읽어 정확히 설명 |
| TODO | 실제 현지 날짜·요일 파일 생성, 연습 항목 체크 |
| 브라우저 | 자기 새 그룹에서 페이지 읽기·스크린샷, 자기 탭만 정리 |
| 컴퓨터 제어 | Obsidian에 열어 둔 허용 문서를 읽는 비파괴 실습, 실제 도구 응답 |
| 문서 도구 | 사용 가능한 기능만 표기, 파일 생성·다시 열기 |
| 이메일 | 선택한 계정 읽기 성공, 변경 권한 범위 명시 또는 보류 사유 |
| 백업 | 소유자가 선택한 백업 위치·실행일·파일 1개 복원 확인 또는 미검증 명시 |
| 독립 실행 | 설치 키트를 참조하지 않는 AI Desk 새 세션과 도구 실행 확인 |

통과하지 않은 항목은 ‘미검증’ 또는 ‘차단: 이유 / 다음 행동 / 담당자’로 남긴다.
모든 체크가 끝나기 전 ‘전체 설치 완료’라고 하지 않는다. 도구 미제공은 미제공으로 알린다.
키트는 보관/삭제를 선택하게 하되 업무 폴더와 혼동하지 않도록 두 경로를 보여준다.
백그라운드 리마인더는 요청할 때만 별도 설정하고 실행 조건·시간대·취소 방법을 실제 검증한다.
