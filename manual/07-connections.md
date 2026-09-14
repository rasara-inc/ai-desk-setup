# 브라우저·메일·컴퓨터 연결

MCP는 AI가 다른 프로그램에 일을 부탁하는 연결 방식입니다.
연결이 목록에 보이는 것, 로그인이 된 것, 실제 업무가 성공한 것은 각각 다릅니다.
아래는 설치 에이전트용 절차입니다. 사용자는 로그인과 권한 요청 때만 함께 하면 됩니다.

## Chrome: 기존 창의 새 작업 그룹

이 키트에는 기존 Chrome 창에서 작업마다 새 그룹을 만드는 도구가 포함됩니다.
설치 후 위치는 `AI Desk/.tools/browser/`입니다. 키트가 없어도 실행됩니다.
**사용자의 기존 탭이나 다른 세션 그룹을 이동·재사용·닫지 않습니다.**

검증 기준 버전: Playwriter 0.5.0 + Chrome 확장 0.0.97.
현재 확장 버전이 다르면 호환성을 현장에서 테스트합니다. 구버전 확장을 임의 사이트에서 받지 않습니다.
공식 설치 출처와 문서: [Playwriter](https://github.com/remorses/playwriter).
도구는 해당 확장의 Chrome API 전달 프로토콜을 사용하므로 향후 업데이트에 따라 바뀔 수 있습니다.
실패하면 구버전 강제 설치·새 Chrome·직접 디버깅 승인으로 우회하지 않습니다.

1. 기존 Node.js 22+와 Chrome, 설치된 확장, relay 실행 여부를 확인합니다.
2. 공식 Playwriter 문서의 Chrome Web Store 링크에서 확장을 설치합니다. 소유자가 권한을 확인합니다.
   기존 설치가 있으면 재설치하지 않습니다. Chrome은 소유자의 평소 프로필을 사용합니다.
3. Bun이 있으면 아래 MCP 명령을 사용합니다. 없으면 공식 Bun 설치 문서를 확인해 설치하거나
   기존 Node 패키지 실행기를 사용할 수 있는지 현재 Playwriter 문서에서 확인합니다.
   Bun 설치: [공식 문서](https://bun.sh/docs/installation).
4. `codex mcp list`에서 같은 연결이 있는지 먼저 확인합니다. 설정 파일에 토큰을 인라인으로 넣지 않습니다.
   Playwriter 연결이 없을 때만 등록합니다(등록은 사용자 전역 연결임을 설명).

```sh
codex mcp add playwriter -- bunx --bun playwriter@0.5.0
```

5. relay가 이미 `127.0.0.1:19988`에서 응답하면 재사용합니다. 없을 때만 별도 터미널에서 실행합니다.

```sh
bunx --bun playwriter@0.5.0 serve --host 127.0.0.1
```

외부 네트워크에 relay를 공개하지 않습니다. `--replace`로 다른 세션 relay를 교체하지 않습니다.
터미널 종료·재부팅 후 relay가 사라질 수 있습니다. 다음 사용 때 상태를 확인하고 같은 명령으로
시작합니다. 자동 시작 서비스는 기본 설치하지 않습니다.

6. 아래 helper로 기존 Chrome 창의 새 탭 그룹을 만들고 반환된 자기 UUID만 사용합니다.

```sh
node "$HOME/AI Desk/.tools/browser/browser.mjs" open 'AI Desk · Practice'
node "$HOME/AI Desk/.tools/browser/browser.mjs" info <UUID>
node "$HOME/AI Desk/.tools/browser/browser.mjs" eval <UUID> /absolute/path/check.js
node "$HOME/AI Desk/.tools/browser/browser.mjs" screenshot <UUID> /absolute/path/check.png
node "$HOME/AI Desk/.tools/browser/browser.mjs" close <UUID>
```

`<UUID>`와 `/absolute/path/...`는 도구가 반환한 ID와 실제 파일 경로로 바꾸는 자리입니다.
`check.js`는 페이지에서 실행할 JavaScript 표현식이며 비동기도 가능합니다.
처음은 빈 페이지의 제목 읽기처럼 비파괴 호출로 확인합니다.
`cdp <UUID> command.json`도 지원하며 JSON은 `{"method":"Page.enable","params":{}}` 형식입니다.
`Page/Runtime/Input/Network/DOM/Emulation` 범위만 받습니다.
그룹의 탭이 이동됐거나 다른 탭이 합쳐지면 도구가 거부합니다. 원래 사용자 상태를 강제로 되돌리지 않습니다.

일반 `context.newPage()`는 공용 그룹을 사용할 수 있으므로 작업 그룹 생성에 쓰지 않습니다.
`session new --direct`는 승인 팝업 반복 문제 때문에 사용하지 않습니다.
Chrome 창이 없으면 소유자에게 평소 Chrome 창을 열도록 안내합니다. helper는 창을 만들지 않습니다.
다운로드 timeout이 나면 Downloads에 이미 저장됐는지 확인한 뒤 재시도 여부를 정합니다.

## 공식 Computer Use: 데스크톱 화면 조작

브라우저 helper는 Mac의 모든 앱을 제어하는 도구가 아닙니다.
화면을 읽고 앱을 클릭하는 기능은 공식 Computer Use를 별도로 설정합니다.
[공식 Computer Use 안내](https://learn.chatgpt.com/docs/computer-use).

현재 공식 데스크톱 앱에서 Codex 또는 Work → Plugins → Computer Use를 열어 설치/활성화합니다.
서버와 skill 활성화를 확인하고 Settings > Computer use에서 필요한 앱 접근을 검토합니다.
macOS의 화면 기록(Screen Recording)·손쉬운 사용(Accessibility) 권한은 소유자가 직접 승인합니다.
관리자 암호·보안 승인 화면을 AI가 대신 누르지 않습니다. 잠금 해제 자동화는 기본으로 켜지 않습니다.

Codex 앱의 AI Desk 새 세션에 Computer Use 도구가 실제 노출되는지 확인합니다.
VS Code 확장으로 쓰는 Mac에서 노출되지 않으면 같은 AI Desk를 Codex 앱에서 열어 화면 조작 업무를 진행합니다.
없는 기능을 설치 완료라고 표시하거나 비공식 MCP로 조용히 대체하지 않습니다.
사용 중인 앱·계정·지역에 기능이 없으면 setup-status.md에 미제공으로 기록합니다.
시험은 Obsidian에 열어 둔, 소유자가 허용한 연습 문서를 읽는 것으로 하며 민감한 앱은 열지 않습니다.

## 문서·메일·일정

현재 공식 플러그인/앱 목록에서 Documents, PDF, Spreadsheets, Presentations 등
필요한 기능을 확인합니다. CLI가 지원하면 `codex plugin list --available --json`과
`codex plugin add --help`로 실제 설치 가능한 ID를 확인한 뒤 설치합니다.
설치자의 캐시 경로·비공개 마켓플레이스를 다른 Mac으로 복사하지 않습니다.

Gmail/Outlook/Calendar는 실제 계정에서 제공되는 공식 연결을 먼저 사용합니다.
공식 연결이 없거나 쓰기 기능이 부족하면 승인된 Chrome 경로를 사용합니다.
연결 권한을 보여주고 소유자가 OAuth 로그인을 직접 합니다.
메일 읽기 실습 후 사용 가능한 동작(읽기/라벨/보관/휴지통/구독 해지)을 각각 확인합니다.
등록 후 새 세션이 필요하면 새 세션에서 확인하며 기존 대화에 도구가 자동 추가됐다고 가정하지 않습니다.

## 연결 해제

계정의 연결된 앱 설정에서 OAuth 권한을 철회하고, 필요하면 `codex mcp remove playwriter`로
해당 연결만 제거합니다. 사용 중인 다른 연결은 건드리지 않습니다.
Computer Use는 공식 앱의 허용 앱 목록과 macOS 개인정보 보호 설정에서 철회합니다.
Chrome 확장은 Chrome의 확장 관리에서 비활성화할 수 있습니다.
