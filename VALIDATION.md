# 검증 상태

## 구현·자체 검증 (2026-09-11)

- Node 테스트 9개 통과: 미리보기 무변경, 실제 설치, 설치 폴더 이동 후 실행,
  재실행, 사용자 내용 보존, 경로/symlink 충돌, Git 대상 거부, 현지 날짜·DST,
  파일 누락·모델/권한 설정 확인, 브라우저 소유권 검증.
- 로컬 Markdown 링크 검사 통과.
- 별도 임시 AI Desk에 설치 후 doctor 통과. 설치 폴더에 Git 없음.
- 설치된 복사본의 browser.mjs를 별도 프로세스로 실행해 기존 Chrome 창의 새 그룹 생성,
  DOM 읽기/쓰기, 한글 문구와 제목 확인, 스크린샷 저장, 소유권 확인, 자기 그룹 정리 성공.
  기존 relay를 재사용했고 새 창·직접 디버깅 연결을 만들지 않음.
- 사용자 계정·인증 파일·고객 자료를 배포물에 포함하지 않음.

자체 구현 검증이며 독립 에이전트 리뷰는 수행하지 않았습니다.
브라우저 확인은 이미 확장과 relay가 준비된 Mac에서 수행했습니다.

## Obsidian 트랙 반영 (2026-09-14)

- 문서 창을 VS Code에서 Obsidian + Codex 맥 앱 조합으로 바꿈. VS Code는 예비 경로로 유지.
- 템플릿에 `.obsidian/app.json`·`appearance.json`·`core-plugins.json` 추가, `AI Desk.code-workspace` 제거.
- doctor가 Obsidian 설정 JSON과 표준 마크다운 링크 설정(`useMarkdownLinks`·`relative`)을 검사.
- Node 테스트 9개·링크 검사 통과. 실제 Obsidian이 이 설정을 읽는지는 현장 검증 대상.

## 새 Mac 현장 검증

미실시. 소유자 계정 로그인, Pro 5x 표시, 새 세션 Sol medium + Full Access,
Obsidian vault 열기·한국어 표시·설정 적용, Codex 앱 프로젝트 열기, Chrome 확장 신규 설치와 재부팅, Computer Use 권한, 메일 읽기,
문서 플러그인 및 백업 복원은 대상 Mac에서 SETUP.md에 따라 검증해야 합니다.
현장 결과는 해당 사용자의 AI Desk/Memory/setup-status.md에 기록합니다.
