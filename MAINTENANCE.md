# 유지보수와 검증

이 저장소는 설치 키트이며 실제 업무 자료나 고객 프로필을 보관하지 않습니다.
배포할 때는 GitHub 소스 ZIP 또는 커밋된 파일만 포함한 archive를 사용합니다.
테스트 임시 폴더·인증 파일·사용자 설정·브라우저 tasks는 배포하지 않습니다.

## 로컬 검증

```sh
node --test tests/*.test.mjs
node scripts/check-links.mjs
```

테스트는 OS 임시 폴더에서 설치, 재실행, 사용자 변경 보존, 경로 충돌, symlink 거부,
Git 거부, 시간대·요일, 기본 모델·권한 및 브라우저 소유권을 검증합니다.
실제 소유자 계정의 결제·메일 변경이나 Mac 설정은 테스트에서 실행하지 않습니다.

## 배포 정책

Node 표준 라이브러리만 사용합니다. npm 의존성은 없습니다.
Playwriter 버전과 확장 프로토콜은 별도 의존성이므로 변경 시 기존 창 보존·그룹 격리·
실제 DOM 읽기·스크린샷·자기 그룹 정리를 검증한 후 갱신합니다.
새 Mac/계정의 설치·권한·문서 UI는 SETUP.md의 현장 인수 확인 대상입니다.

Codex 모델·권한·플러그인 지원은 현재 공식 문서와 설치된 CLI를 확인합니다.
고정 기본값은 Sol medium + Full Access이며 사용자 요구 없이 다른 모델로 변경하지 않습니다.
설정 파일은 새 세션 UI에서 실제 적용 여부를 확인합니다.

## 확인 출처 (2026-09-11)

- [Codex 설정](https://learn.chatgpt.com/docs/config-file/config-reference)
- [IDE 설정](https://learn.chatgpt.com/docs/developer-settings?surface=ide)
- [권한](https://learn.chatgpt.com/docs/sandboxing)
- [Computer Use](https://learn.chatgpt.com/docs/computer-use)
- [Playwriter](https://github.com/remorses/playwriter)
- [VS Code 설정](https://code.visualstudio.com/docs/configure/settings)

로컬 구현 검증과 새 Mac 현장 검증 상태는 [VALIDATION.md](VALIDATION.md)에 구분합니다.
