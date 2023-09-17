# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.8.4](https://github.com/anpigon/obsidian-tistory-plugin/compare/0.8.3...0.8.4) (2023-09-17)


### Bug Fixes

* **utils.ts:** update setActiveLeaf function call to pass an object with the focus property set to false to prevent the leaf from gaining focus when opening a file ([9811773](https://github.com/anpigon/obsidian-tistory-plugin/commit/981177381fbb77efefdc4bbf33bc2e88ba390f4a))

### [0.8.3](https://github.com/anpigon/obsidian-tistory-plugin/compare/0.8.2...0.8.3) (2023-09-17)


### Bug Fixes

* **TistoryPlugin.ts:** handle case when activeView.file is null or undefined to prevent errors ([6cc1f47](https://github.com/anpigon/obsidian-tistory-plugin/commit/6cc1f4759f42a82944df02c20e508631f35511b2))


### Code Refactoring

* **PublishConfirmModal.tsx:** reorganize imports for better readability and consistency ([d76bf7b](https://github.com/anpigon/obsidian-tistory-plugin/commit/d76bf7b6697eb62f9c3639d71380c62a1e82122c))
* **TistoryPlugin.ts:** remove empty keys from newFrontMatter object before modifying file content ([33c1807](https://github.com/anpigon/obsidian-tistory-plugin/commit/33c1807a6e41446523723be03d0edac276c32b59))

### [0.8.2](https://github.com/anpigon/obsidian-tistory-plugin/compare/0.8.1...0.8.2) (2023-04-26)


### Code Refactoring

* **publisher.ts:** replace 'this.app' with 'this.plugin.app' ([9d87604](https://github.com/anpigon/obsidian-tistory-plugin/commit/9d87604ba9ea7888ed6cd0fa6a95937855e6a7e6))

### [0.8.1](https://github.com/anpigon/obsidian-tistory-plugin/compare/0.8.0...0.8.1) (2023-04-26)


### Code Refactoring

* **markdown.ts:** use MarkdownIt constructor without object destructuring ([46328b4](https://github.com/anpigon/obsidian-tistory-plugin/commit/46328b447efb047ec464a893b2c38b2fb49fa44e))

## [0.8.0](https://github.com/anpigon/obsidian-tistory-plugin/compare/0.7.4...0.8.0) (2023-04-26)


### Features

* **TistoryClient.ts:** add support for fetching and returning child categories ([b739a6b](https://github.com/anpigon/obsidian-tistory-plugin/commit/b739a6b3035bc699a85441899c58f22b4a847ff9))
* **TistoryPlugin:** add support for Mathjax conversion ([553ad2d](https://github.com/anpigon/obsidian-tistory-plugin/commit/553ad2dac732262682dffef6dba300d66fcbd28c))


### Bug Fixes

* **markdown.ts:** add 'code' to the list of skipped HTML tags ([938969a](https://github.com/anpigon/obsidian-tistory-plugin/commit/938969a872030d2f2329447ddffa90a0086f0b39))

### [0.7.4](https://github.com/anpigon/obsidian-tistory-plugin/compare/0.7.3...0.7.4) (2023-04-15)


### Code Refactoring

* **publisher.ts:** simplify internal file link display ([ae1e2ac](https://github.com/anpigon/obsidian-tistory-plugin/commit/ae1e2acb74628b7f4b47524e437ab4c54f448543))

### [0.7.3](https://github.com/anpigon/obsidian-tistory-plugin/compare/0.7.2...0.7.3) (2023-03-16)


### Features

* 이미지 width 사용하여 html 렌더링 ([18813cc](https://github.com/anpigon/obsidian-tistory-plugin/commit/18813ccd714336b62ba1fa2dee9072519a133673))
* hr 태그에 티스토리 style 지정 ([57f9dc5](https://github.com/anpigon/obsidian-tistory-plugin/commit/57f9dc5eb680fd391730f2752f28ca8e3b306f83))


### Bug Fixes

* 단락의 개행을 모두 br 태그로 변환 ([6f1c2b7](https://github.com/anpigon/obsidian-tistory-plugin/commit/6f1c2b72cdcbb51795dff5f21f9d684793b62306))

### [0.7.2](https://github.com/anpigon/obsidian-tistory-plugin/compare/0.7.1...0.7.2) (2023-02-19)


### Bug Fixes

* code block에서 빈 라인이 여러번 들어가는 이슈 ([fe50aee](https://github.com/anpigon/obsidian-tistory-plugin/commit/fe50aeedf5a34e1afe49b8eb42dc953924eda8dd))

### [0.7.1](https://github.com/anpigon/obsidian-tistory-plugin/compare/0.7.0...0.7.1) (2023-02-18)

## [0.7.0](https://github.com/anpigon/obsidian-tistory-plugin/compare/0.6.2...0.7.0) (2023-02-18)


### Features

* 블로그 푸터 기능 추가 ([6198ab3](https://github.com/anpigon/obsidian-tistory-plugin/commit/6198ab369bf0c0eaae2c8df869f002f0123397ef))
* 설정에 푸터 입력 기능 ([c1f36d4](https://github.com/anpigon/obsidian-tistory-plugin/commit/c1f36d4dd0a646b7ab2a5e33db53ea2846f169e7))

### [0.6.2](https://github.com/anpigon/obsidian-tistory-plugin/compare/0.6.1...0.6.2) (2023-02-18)


### Bug Fixes

* 코드 블럭에 html 태그가 포함된 경우 오류 ([1a5e007](https://github.com/anpigon/obsidian-tistory-plugin/commit/1a5e007ecec08a48d08bec7afb6cba1cdb3ec0ac))

### [0.6.1](https://github.com/anpigon/obsidian-tistory-plugin/compare/0.6.0...0.6.1) (2023-02-18)


### Bug Fixes

* build type error ([1a4c2d0](https://github.com/anpigon/obsidian-tistory-plugin/commit/1a4c2d0f3e24758eb64c19a767e4b0e3a18dccce))

## [0.6.0](https://github.com/anpigon/obsidian-tistory-plugin/compare/0.5.0...0.6.0) (2023-02-18)


### Bug Fixes

* 코드 블럭이 한줄로 바뀌는 문제 ([e52b2e8](https://github.com/anpigon/obsidian-tistory-plugin/commit/e52b2e8197f6d40a1ae76bbc168fd808eb3687cd))

## [0.5.0](https://github.com/anpigon/obsidian-tistory-plugin/compare/0.4.0...0.5.0) (2023-02-17)


### Features

* 티스토리 링크면 a tag로 변환 ([0931d0a](https://github.com/anpigon/obsidian-tistory-plugin/commit/0931d0a5fc4a21f1c20d458c23a951cef038970c))


### Bug Fixes

* 글 발행시마다 노트 내용이 한줄씩 내려가는 이슈 ([6275c75](https://github.com/anpigon/obsidian-tistory-plugin/commit/6275c75afb6dc31095e5785ebe6b76837474a940))
* image parser ([00cd81e](https://github.com/anpigon/obsidian-tistory-plugin/commit/00cd81e53d78e337735794e3f0b3cabc515a1779))

## [0.4.0](https://github.com/anpigon/obsidian-tistory-plugin/compare/0.3.1...0.4.0) (2023-02-12)


### Features

* 예약 기능 추가 ([c90d00d](https://github.com/anpigon/obsidian-tistory-plugin/commit/c90d00d75826a019fa24ac6e59c9a8a4cd74b489))

### [0.3.1](https://github.com/anpigon/obsidian-tistory-plugin/compare/0.3.0...0.3.1) (2023-02-12)


### Bug Fixes

* build error ([5f7e6ef](https://github.com/anpigon/obsidian-tistory-plugin/commit/5f7e6ef5c65154558705258b473584567107543f))

## [0.3.0](https://github.com/anpigon/obsidian-tistory-plugin/compare/0.2.0...0.3.0) (2023-02-12)


### Features

* 태그 입력 기능 추가 ([b774611](https://github.com/anpigon/obsidian-tistory-plugin/commit/b7746111c774e51a38da7b9d70dad2f9b236c574))


### Bug Fixes

* 로그아웃 안되는 이슈 ([d2a0eee](https://github.com/anpigon/obsidian-tistory-plugin/commit/d2a0eee659399b562181b6082e3d47393753dc54))
* 블로그에 카테고리 정보가 없는 경우 발행시 에러 발생 [#1](https://github.com/anpigon/obsidian-tistory-plugin/issues/1) ([9b433c4](https://github.com/anpigon/obsidian-tistory-plugin/commit/9b433c4c28e3b346b64b54eb4e8f27b9d73aa337))
* 티스토리 설정 > 블로그 셀렉트 박스 ([5b52fa1](https://github.com/anpigon/obsidian-tistory-plugin/commit/5b52fa110c016b15664bf53919adef482c5a1623))


### Code Refactoring

* 티스토리 발행 모달 팝업 코드 개선 ([9a0a4b2](https://github.com/anpigon/obsidian-tistory-plugin/commit/9a0a4b257b6962c9958dea3560be0d7b9e154ca0))
* 티스토리 설정 화면 코드 개선 ([3206246](https://github.com/anpigon/obsidian-tistory-plugin/commit/3206246f468910f598f9619574249c7d514c104a))

### [0.2.4](https://github.com/anpigon/obsidian-tistory-plugin/compare/0.2.3...0.2.4) (2022-11-13)


### Bug Fixes

* 블로그에 카테고리 정보가 없는 경우 발행시 에러 발생 ([b8fa7bb](https://github.com/anpigon/obsidian-tistory-plugin/commit/b8fa7bb5ae5f0a220ab1e1e624e48b1b0d0fbb5f))

### [0.2.3](https://github.com/anpigon/obsidian-tistory-plugin/compare/0.2.1...0.2.3) (2022-11-12)


### Bug Fixes

* 티스토리 설정 > 블로그 셀렉트 박스 ([5b52fa1](https://github.com/anpigon/obsidian-tistory-plugin/commit/5b52fa110c016b15664bf53919adef482c5a1623))


### Code Refactoring

* 티스토리 발행 모달 팝업 코드 개선 ([9a0a4b2](https://github.com/anpigon/obsidian-tistory-plugin/commit/9a0a4b257b6962c9958dea3560be0d7b9e154ca0))
* 티스토리 설정 화면 코드 개선 ([3206246](https://github.com/anpigon/obsidian-tistory-plugin/commit/3206246f468910f598f9619574249c7d514c104a))

### [0.2.2](https://github.com/anpigon/obsidian-tistory-plugin/compare/0.2.1...0.2.2) (2022-11-12)


### Code Refactoring

* 티스토리 발행 모달 팝업 코드 개선 ([9a0a4b2](https://github.com/anpigon/obsidian-tistory-plugin/commit/9a0a4b257b6962c9958dea3560be0d7b9e154ca0))

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
