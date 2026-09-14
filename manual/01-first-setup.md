# 처음 설치하기

설치 키트는 ‘책상 조립 설명서’, AI Desk는 ‘매일 쓰는 책상’입니다.
설치 후에는 AI Desk만 열면 됩니다. 업무 파일은 기본으로 이 Mac에 저장되며 GitHub로 올라가지 않습니다.
AI에게 읽힌 자료는 사용하는 AI 서비스에서 처리될 수 있으므로 로컬 저장과 서비스 처리는 구분합니다.

## 준비할 것

- 자신의 Mac 로그인, 자신의 ChatGPT 계정, 인터넷
- 소유자가 선택·결제한 ChatGPT Pro 5x 구독
- 사용 중인 메일의 로그인과 2단계 인증 수단
- 거주 도시, 개인/사업/직장 중 사용할 영역

기본은 Pro 5x입니다. 실제 청구통화·세금·금액은 가입 화면에서 확인하세요.
API 키나 별도의 API 결제는 필요하지 않습니다. 기존 구독이 있다면 중복 가입하지 않습니다.
[OpenAI 요금 안내](https://learn.chatgpt.com/docs/pricing).

## 아직 Codex가 없을 때

1. [Codex 맥 앱](https://learn.chatgpt.com/docs/app)을 설치합니다.
   다운로드: `https://persistent.oaistatic.com/codex-app-prod/Codex.dmg`
2. Codex 앱을 열고 자신의 ChatGPT 계정으로 로그인합니다.
3. 받은 설치 키트 폴더를 Codex 앱의 프로젝트로 추가하고 README의 설치 요청 문장을 보냅니다.
4. 문서를 보고 고치는 창은 [Obsidian](https://obsidian.md/download)입니다. 설치 에이전트가
   AI Desk 폴더를 만든 뒤 함께 엽니다. 업무용도 무료입니다.

Codex 앱을 설치할 수 없는 Mac에서는 [VS Code](https://code.visualstudio.com/download)에
**OpenAI가 게시한 Codex** 확장을 설치해 같은 절차를 진행합니다.
[공식 IDE 안내](https://learn.chatgpt.com/docs/codex/ide).

에이전트가 실행 환경 설치를 도울 때 공식 출처를 사용합니다:
[Node.js](https://nodejs.org/en/download), [Chrome](https://www.google.com/chrome/),
[Codex CLI](https://learn.chatgpt.com/docs/codex/cli).
Node.js는 설치 도구를 실행하는 프로그램이며 사용자가 코딩을 배울 필요는 없습니다.

## 새 세션 기본값

**GPT-5.6 Sol / medium + Full Access**가 AI Desk의 기본입니다.
설치 시 `.codex/config.toml`에 적용하고 새 세션의 모델·권한 표시를 함께 확인합니다.
다른 프로젝트나 예전에 열어 둔 세션은 설정이 다를 수 있습니다.
복잡한 판단이 필요하면 AI가 Astra low 전환을 제안합니다.

Full Access는 파일과 명령 실행의 기술적 제한을 넓힙니다.
중요한 삭제·외부 발송·결제 전에 묻는 것은 별도의 대화 규칙입니다.
OS 권한·계정 인증을 대신 승인하지 않으며 회사 관리 정책도 우회하지 않습니다.
[공식 권한 안내](https://learn.chatgpt.com/docs/sandboxing).
