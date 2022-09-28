# Obsidian Tistory Plugin (unofficial)

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/anpigon/obsidian-tistory-plugin/Release%20Obsidian%20plugin?style=flat-square&logo=github)
![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/anpigon/obsidian-tistory-plugin?style=flat-square&sort=semver)
![GitHub all release Downloads](https://img.shields.io/github/downloads/anpigon/obsidian-tistory-plugin/total?style=flat-square&sort=semver)
![License](https://img.shields.io/github/license/anpigon/obsidian-tistory-plugin?style=flat-square)
![Hits](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2Fanpigon%2Fobsidian-tistory-plugin&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=true)

아직 개발 중인 앱입니다. 버그나 개선사항이 있다면 [Issues](https://github.com/anpigon/obsidian-tistory-plugin/issues)에 남겨주세요.

<br>

## 설치하기

- 방법 #1: [OBSIDIAN42 - BRAT](https://obsidian.md/plugins?id=obsidian42-brat)를 사용하여 플러그인을 설치합니다. "Add Beta Plugin"]" 버튼을 눌러 `anpigon/obsidian-tistory-plugin` 를 입력합니다.
- 방법 #2: [![GitHub release (latest by SemVer and asset including pre-releases)](https://img.shields.io/github/downloads-pre/anpigon/obsidian-tistory-plugin/latest/main.js?sort=semver)](https://github.com/anpigon/obsidian-tistory-plugin/releases) 최신 릴리스에서 Assets(`main.js`, `manifest.json`, `styles.css`)를 다운로드 합니다. 그리고 옵시디언 볼트의 `.obsidian/plugins` 경로에 `tistory` 폴더를 생성하고 다운로드 받은 파일 3개를 넣어줍니다.

<br>

## 티스토리 OpenAPI에서 API 키 발급

옵시디언 티스토 플러그인을 사용하기 위해서는 [티스토리 OpenAPI](https://www.tistory.com/guide/api/manage/register) 에서 앱을 생성하고 키를 발급 받아야합니다.

<img src="https://user-images.githubusercontent.com/3969643/189274934-5b7be8b7-b6b3-4408-b7b2-d5a0dee8b799.png" width="600">

CallBack에는 반드시 `obsidian://tistory-oauth`를 입력해주세요.<br>
앱 생성 후 발급받은 `App ID`와 `Secret Key`를 옵시디언 티스토리 플러그인에 입력합니다.

<br>

## 티스토리 플러그인 설정

<img width="600" alt="" src="https://user-images.githubusercontent.com/3969643/192658110-ef4386a7-58a2-4592-9c23-f0acbbff32fb.png">

1. 티스토리 인증 방식은 "내 티스토리 앱 사용"을 선택합니다.
2. App ID와 Secret Key에는 티스토리 OpenAPI에서 발급받은 키를 입력합니다.
3. "인증하기" 버튼을 선택합니다.
4. 마지막으로 티스토리 기본 블로그를 선택합니다.

<img width="500" alt="" src="https://user-images.githubusercontent.com/3969643/192658503-96160902-355f-4297-b368-26b934d001d4.png">

## 사용 방법

작성 중...

<br>

---

<br>

## 후원하기

커피 한 잔의 값으로 개발을 지원할 수 있습니다.

<a href="https://anpigon.github.io/buymeacoffee/">카카오 페이</a>
