# AI Desk Setup

캐나다에 거주하는 한국어 사용자를 위한 Mac AI 업무 환경 설치 키트입니다.
**폴더·파일 이름은 영어, 대화·매뉴얼·TODO 내용은 한국어**입니다.
개발이나 Git을 배우지 않아도 됩니다. Codex가 이 저장소를 읽고 설치를 진행합니다.

## 다른 Mac에서 시작하기

1. Codex 맥 앱을 설치하고 **그 Mac 소유자의 ChatGPT 계정**으로 로그인합니다.
   설치 전이라면 [처음 설치하기](manual/01-first-setup.md)를 보세요.
   문서 창은 Obsidian입니다. 설치 에이전트가 업무 폴더를 만든 뒤 함께 엽니다.
2. 이 공개 저장소를 clone하거나 [ZIP 다운로드](https://github.com/rasara-inc/ai-desk-setup/archive/refs/heads/main.zip)로 받습니다.
   초대나 GitHub 로그인 없이 사용할 수 있습니다.
3. Codex 앱에서 받은 `ai-desk-setup` 폴더를 프로젝트로 열고 아래 문장을 보내세요.

```text
이 저장소의 AGENTS.md와 SETUP.md를 읽고 이 Mac에 AI Desk를 설치해 줘.
나는 캐나다에 사는 한국어 사용자이고 개발자는 아니야.
폴더와 파일 이름은 영어, 대화와 설명은 항상 한국어로 해 줘.
기존 자료와 설정은 보존하고, 네가 할 수 있는 설치와 검증은 끝까지 진행해 줘.
내 로그인이나 권한 승인이 필요한 순간에만 정확히 무엇을 해야 하는지 알려 줘.
마지막에는 AI Desk를 열고 내가 첫 업무를 직접 해 보도록 도와줘.
```

터미널에서 받으려면 다음 명령을 사용합니다(인증 불필요):

```sh
git clone https://github.com/rasara-inc/ai-desk-setup.git
cd ai-desk-setup
```

기존 설치 키트 업데이트는 키트 폴더에서 `git pull --ff-only`로 합니다.
업무 폴더 `AI Desk`에는 Git을 만들거나 pull하지 않습니다.
ZIP 사용자는 GitHub 로그인·Git 설치가 필요 없습니다.

## 완성되는 업무 폴더

```text
~/AI Desk/
├── START-HERE.md
├── AGENTS.md
├── 00_inbox/
├── 00_TODO/          YYYY-MM-DD-Ddd.md, recurring.md, projects.md, Archived/
├── Personal/         선택
├── Business/         선택, 필요하면 회사별 하위 폴더
├── Work/             선택
├── Memory/           공통 선호·설정·업무 인계
├── manual/           한국어 매뉴얼
└── .tools/           설치 후에도 남는 브라우저 도구
```

숨김 폴더 `.obsidian`(문서 창 설정), `.codex`(모델·권한), `.vscode`(VS Code 예비)도 함께 만듭니다.
화면은 **Obsidian(문서) + Codex 앱(AI 대화)** 두 창이며 둘 다 같은 폴더를 봅니다.
Codex 앱을 설치할 수 없는 Mac은 VS Code + Codex 확장으로 같은 폴더를 엽니다.

기본은 ChatGPT **Pro 5x**, **GPT-5.6 Sol / medium + Full Access**입니다. 복잡하거나 실수 비용이
큰 작업은 **GPT-6 Astra / low** 전환을 한 번 제안하고 실제 선택을 확인합니다.
구독 결제·변경은 소유자가 합니다. 가격·통화·세금·계정별 모델 제공 여부는
설치 당일 결제 화면과 모델 선택기에서 확인합니다. API 과금은 기본으로 연결하지 않습니다.
[공식 요금 안내](https://learn.chatgpt.com/docs/pricing).

## 설치 담당자

- [SETUP.md](SETUP.md): 설치 에이전트의 순서와 완료 기준
- [검증·복구](manual/09-recovery.md): 재실행, 백업, 연결 해제
- [브라우저·컴퓨터 제어](manual/07-connections.md): MCP와 OS 권한
- [유지보수](MAINTENANCE.md): 테스트와 버전 정책

Node.js 22 이상이 준비된 뒤 미리보기 / 실제 설치:

```sh
node scripts/setup.mjs --areas personal,business
node scripts/setup.mjs --areas personal,business --apply
node scripts/doctor.mjs --target "$HOME/AI Desk"
```

대상 폴더는 `--target`, 시간대는 `--timezone America/Toronto`로 지정할 수 있습니다.
기본 시간대는 Mac의 현재 시간대입니다. `--areas` 생략 시 개인·사업·직장 폴더는 만들지 않습니다.
기존 파일은 덮어쓰지 않으며, 다른 내용은 `conflict`로 보고하여 에이전트가 비교합니다.
**스크립트 통과는 폴더 설치 검증입니다. 로그인·브라우저·Computer Use·백업은 현장 검증이 별도입니다.**

설치·개인화·새 세션 검증을 마치면 이 키트는 필요 없습니다. 도구와 매뉴얼은 업무 폴더에
복사되며 키트 경로를 참조하지 않습니다. 키트 삭제도 소유자가 원할 때만 합니다.
