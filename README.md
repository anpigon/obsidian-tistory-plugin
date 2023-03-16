# Obsidian Tistory Plugin (unofficial)

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/anpigon/obsidian-tistory-plugin/release.yml?style=flat-square&logo=github)
![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/anpigon/obsidian-tistory-plugin?style=flat-square&sort=semver)
![GitHub all release Downloads](https://img.shields.io/github/downloads/anpigon/obsidian-tistory-plugin/total?style=flat-square&sort=semver)
![License](https://img.shields.io/github/license/anpigon/obsidian-tistory-plugin?style=flat-square)
![Hits](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Fanpigon%2Fobsidian-tistory-plugin&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=true)

옵시디언 에디터에서 티스토리에 글을 등록하고 수정할 수 있습니다.
<br>아직 개발 중인 앱입니다. 버그나 개선사항이 있다면 [Issues](https://github.com/anpigon/obsidian-tistory-plugin/issues)에 남겨주세요.

<br>

## ☕️ 후원하기

커피 한 잔의 값으로 개발을 지원할 수 있습니다.

<a href="https://www.buymeacoffee.com/anpigon" target="_blank"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=anpigon&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff" /></a> <a href="https://anpigon.github.io/buymeacoffee/">[카카오페이로 후원하기]</a>

<br>

## 📍 Changelog

### v0.7.2

- 블로그 푸터 옵션 기능 추가

### v0.6.2

- 코드 블럭 개선

### v0.5.0

- 가능하면 내부 링크를 티스토리 링크로 변환하도록 개선
- 글 발행할 때 마다 첫 줄에 빈라인이 계속 삽입되는 현상 버그 수정

### v0.4.0

- 글 예약 발행 기능 추가

### v0.3.0

- 글 태그 입력 기능 추가
- UI 개선 및 일부 버그 수정

<br>

## 🚀 설치하기

- 방법 #1: [OBSIDIAN42 - BRAT](https://obsidian.md/plugins?id=obsidian42-brat)를 사용하여 플러그인을 설치합니다. "Add Beta Plugin"]" 버튼을 눌러 `anpigon/obsidian-tistory-plugin` 를 입력합니다.
- 방법 #2: [![GitHub release (latest by SemVer and asset including pre-releases)](https://img.shields.io/github/downloads-pre/anpigon/obsidian-tistory-plugin/latest/main.js?sort=semver)](https://github.com/anpigon/obsidian-tistory-plugin/releases) 최신 릴리스에서 Assets(`main.js`, `manifest.json`, `styles.css`)를 다운로드 합니다. 그리고 옵시디언 볼트의 `.obsidian/plugins` 경로에 `tistory` 폴더를 생성하고 다운로드 받은 파일 3개를 넣어줍니다.

<br>

## ⚙️ 티스토리 플러그인 설정하기

옵시디언 설정 > 서드파티 플러그인 > Tistory에서 "인증하기" 버튼을 누릅니다.

<img width="600" alt="" src="https://user-images.githubusercontent.com/3969643/193976342-0bc1b81b-90f7-40e5-9178-2b215fc94341.png">

<br>티스토리 인증에 성공하면, 글을 발행할 티스토리 블로그를 선택합니다.

<img width="600" alt="" src="https://user-images.githubusercontent.com/3969643/193976338-15217f03-0f1a-4467-8f43-3affceef7d83.png">

<br>

## ✍️ 티스토리에 글 발행하는 방법

글을 작성한 에디터 창에서 명령어 팔레트(`Cmd + P`)를 실행하고, "Tistory: Publish to Tistory"를 선택합니다.

<img width="600" alt="" src="https://user-images.githubusercontent.com/3969643/193435836-72ba5abd-821d-403c-ac99-f049f129067e.png">

> 티스토리 글 발행을 더 간편하게 사용하고 싶으면 해당 명령어에 단축키를 지정하면 됩니다.
> 단축키를 지정하는 방법은 [단축키 지정하기](#단축키-지정하기)에서 설명합니다.

<br>그 다음 "티스토리 글 발행" 모달 팝업이 나타나면 속성을 확인하고 "발행하기" 버튼을 선택합니다.

<img width="600" alt="" src="https://user-images.githubusercontent.com/3969643/193435877-6066154d-5d13-4220-a8da-570f8ce4983c.png">

티스토리 글 업로드가 성공하면 메타데이터가 프론트매터(Frontmatter)에 자동 추가됩니다.

<img width="600" alt="" src="https://user-images.githubusercontent.com/3969643/193435956-07421a59-37d7-44df-ae8e-0e3074eb5c2a.png">

자동으로 추가된 프론트매터는 글을 수정할 때 사용되는 데이터이므로 절대 삭제하면 안됩니다.
<br>프론트매터에 추가된 데이터 속성에 대해서는 아래에서 설명합니다.

### 🗄️ 프론트메터 속성

| 속성              | 설명                                           |
| ----------------- | ---------------------------------------------- |
| tistoryBlogName   | 블로그 이름                                    |
| tistoryTitle      | 글 제목                                        |
| tistoryTags       | 태그(쉼표로 구분)                              |
| tistoryVisibility | 발행상태 (0: 비공개, 3: 발행)                  |
| tistoryCategory   | 글 카테고리 ID                                 |
| tistoryPostId     | 글 Post ID (글 수정시 필요)                    |
| tistoryPostUrl    | 글 URL                                         |
| tistoryPublished  | 발행 예약일 (yyyy-MM-ddTHH:mm)                 |
| tistorySkipModal  | 다음 발행부터 모달창 띄우지 않기 (true, false) |

<br>

### ⌘ 단축키 지정하기

단축키를 지정하고 싶으면 옵시디언 설정 > 단축키에서 "Tistory: Publish to Tistory"를 찾아 원하는 단축키를 설정합니다.

<img width="600" alt="" src="https://user-images.githubusercontent.com/3969643/193435868-522a8c0b-a61d-4647-83a3-0371d5c5fc0d.png">

<br>

## 🤝 추가 내용

- 현재 티스토리 플러그인은 노트에 포함된 내부 이미지를 `Base64 encoded data` 형태로 블로그 내용에 포함하여 업로드하고 있습니다.
- 이슈 https://github.com/anpigon/obsidian-tistory-plugin/issues/2 에서 알려진 바와 같이 용량이 큰 이미지가 포함된 글을 발행하면 "글자수 초과 에러"가 발생합니다.
- 이 문제는 해결할 계획입니다. 당분간 이미지 업로드에 [옵시디언 Imgur 플러그인](https://obsidian.md/plugins?id=obsidian-imgur-plugin)을 사용을 권장합니다.

<br>

## 📆 계획된 기능

- 티스토리 이미지 업로드 기능
- 티스토리 블로그 목록 가져오기 및 검색
- 타 플러그인 렌더링 지원
