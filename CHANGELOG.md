# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.2.1](https://github.com/anpigon/obsidian-tistory-plugin/compare/0.2.0...0.2.1) (2022-11-12)


### Bug Fixes

* 로그아웃 안되는 이슈 ([d2a0eee](https://github.com/anpigon/obsidian-tistory-plugin/commit/d2a0eee659399b562181b6082e3d47393753dc54))

## [0.2.0](https://github.com/anpigon/obsidian-tistory-plugin/compare/0.1.0...0.2.0) (2022-10-24)


### Features

* 수정시 모달창 스킵 기능 추가 ([93f3dbf](https://github.com/anpigon/obsidian-tistory-plugin/commit/93f3dbf68bcd23f9a8e3a1d9de9ccc71abe4a30b))


### Code Refactoring

* use optional chaining to get the blog name ([a2c0eb0](https://github.com/anpigon/obsidian-tistory-plugin/commit/a2c0eb0bd90cd8037b419dbba97ff269be6d022b))

## [0.1.0](https://github.com/anpigon/obsidian-tistory-plugin/compare/0.0.6...0.1.0) (2022-10-05)


### Features

* 이미지  to base64 ([2371c22](https://github.com/anpigon/obsidian-tistory-plugin/commit/2371c2280948b78046f07edb7979d80e0766c809))
* 하이라이트 ([84d7cdb](https://github.com/anpigon/obsidian-tistory-plugin/commit/84d7cdb05ee1e1fc472a0881c114608e48b77f6b))


### Bug Fixes

* 인증 콜백 함수 수정 ([f5f3df1](https://github.com/anpigon/obsidian-tistory-plugin/commit/f5f3df1187ee6f921f9f5b91b22b6af26cf189b3))


### Reverts

* Revert "rename: from PublishConfirmModalView to PublishConfirmModal" ([9180d9b](https://github.com/anpigon/obsidian-tistory-plugin/commit/9180d9b906b272cdb19796016e3d441d15ad4a0d))


### Code Refactoring

* 코드 정리 ([416503e](https://github.com/anpigon/obsidian-tistory-plugin/commit/416503e40155438e1609b8592c368f8d38a0bec7))
* createBase64Images function ([3666771](https://github.com/anpigon/obsidian-tistory-plugin/commit/36667712e6bdb3acab011e71ab5c06c8192b899c))
* TistoryAuthModal  클래스의 updateText 함수를 public으로 ([b962cbc](https://github.com/anpigon/obsidian-tistory-plugin/commit/b962cbcd6fdc7dbd42f281762787b3f598e4f401))
* TistorySettingTab 클래스 멤버 변수를 private로 ([dce6397](https://github.com/anpigon/obsidian-tistory-plugin/commit/dce6397e909e2775317b7a4beaca011e17a4c7ee))

### [0.0.6](https://github.com/anpigon/obsidian-tistory-plugin/compare/0.0.5...0.0.6) (2022-10-02)


### Features

* 간편 인증 기능 ([dae13b1](https://github.com/anpigon/obsidian-tistory-plugin/commit/dae13b11000cb3b62e49678000e16ab4be1180ac))
* 티스토리 파일 업로드 API 구현 ([ccc1656](https://github.com/anpigon/obsidian-tistory-plugin/commit/ccc1656e76f4ef540b1badc9ac4d80e59e1143ce))


### Bug Fixes

* 선택된 블로그가 없는 경우, 첫번째 블로그 자동 선택하기 ([e378230](https://github.com/anpigon/obsidian-tistory-plugin/commit/e3782301fc45d572c714480b985d655bb604bd4f))


### Code Refactoring

* add AuthenticationError ([c20dfc1](https://github.com/anpigon/obsidian-tistory-plugin/commit/c20dfc1a5aea8087baf596a7cfaf231ba7ad0f3c))
* LocalStorage 함수를 클래스 함수로 변경 ([4a87bf5](https://github.com/anpigon/obsidian-tistory-plugin/commit/4a87bf5fad6e9444ffc058ed541b4cc101e36931))

### [0.0.5](https://github.com/anpigon/obsidian-tistory-plugin/compare/0.0.4...0.0.5) (2022-09-18)


### Bug Fixes

* 컨텐츠 trim 이슈 수정 ([010d9fb](https://github.com/anpigon/obsidian-tistory-plugin/commit/010d9fb3228b6b8de8f3af9a6082de3dfcb1ac8d))
* markdown to html 옵션 설정 ([e6e0361](https://github.com/anpigon/obsidian-tistory-plugin/commit/e6e0361a24c98d4ce06ca51a48387fe26fcb0381))


### Code Refactoring

* 마크다운 to html 개선 ([242fbeb](https://github.com/anpigon/obsidian-tistory-plugin/commit/242fbebf05628dad42b87c2bdc4b20e10d097ee2))
* 프론트매터 변수명 수정 ([9e6d04d](https://github.com/anpigon/obsidian-tistory-plugin/commit/9e6d04d3a3f6755892c1dab753058388491113ad))

### [0.0.4](https://github.com/anpigon/obsidian-tistory-plugin/compare/0.0.3...0.0.4) (2022-09-17)


### Features

* 컨텐츠에서 주석 제거 ([bb46286](https://github.com/anpigon/obsidian-tistory-plugin/commit/bb462865fa9eb96a104347ef20c0303eadcb758b))


### Bug Fixes

* 티스토리 인증 완료 후 첫번째 블로그 자동 선택 ([f745c0d](https://github.com/anpigon/obsidian-tistory-plugin/commit/f745c0d25e87d4555af140d5dc94975f50b5d88d))
* 프론트메터에 position 추가되는 이슈 ([59be387](https://github.com/anpigon/obsidian-tistory-plugin/commit/59be387b19dd527a5685fd754b21e5928317b466))
* preview 모드에서 글 발행 가능 ([c2bf86d](https://github.com/anpigon/obsidian-tistory-plugin/commit/c2bf86deb012f4c3e78e83fd0ceb67eb88a661c3))
* TistorySettingTab 화면 react 렌더링 warning 제거 ([569432a](https://github.com/anpigon/obsidian-tistory-plugin/commit/569432ab9241646a77cd30ba5f7039a9f1006f6a))
* type error in TistoryPosts ([515fa91](https://github.com/anpigon/obsidian-tistory-plugin/commit/515fa91651679d58ccf52310737c22f40d01616c))


### Code Refactoring

* PublishConfirmModal 필요없는 PluginProvider 코드 삭제 ([4fbb255](https://github.com/anpigon/obsidian-tistory-plugin/commit/4fbb255c6289f44f39feab6e3d7e04d698b4ed72))
* SettingItem error 변수명 수정 ([eeea4fe](https://github.com/anpigon/obsidian-tistory-plugin/commit/eeea4fe82d4505c5dbc0902d0f5d8b600008f39f))

### [0.0.3](https://github.com/anpigon/obsidian-tistory-plugin/compare/0.0.1...0.0.3) (2022-09-17)


### Bug Fixes

* 기존 프론트매터 데이터가 삭제되는 이슈 ([0bf78ec](https://github.com/anpigon/obsidian-tistory-plugin/commit/0bf78ec0c9c37ead356ce13c409a41d15b231cb7))
* 설정 유효성 체크 로직 개선 ([13241c0](https://github.com/anpigon/obsidian-tistory-plugin/commit/13241c00455ea64ca355f57ffbaf865943f5d561))


### Code Refactoring

* 티스토리 인증 오류 메시지 개선 ([ff0b717](https://github.com/anpigon/obsidian-tistory-plugin/commit/ff0b7178fe53c6e5de4dc7b1c9871ed62aa0f51a))

### [0.0.2](https://github.com/anpigon/obsidian-tistory-plugin/compare/0.0.1...0.0.2) (2022-09-15)
