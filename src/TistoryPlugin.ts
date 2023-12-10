/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  App,
  MarkdownView,
  Notice,
  parseFrontMatterTags,
  Plugin,
  PluginManifest,
  stringifyYaml,
  TFile,
} from 'obsidian';

import Publisher from '~/helper/publisher';
import { TistoryAuthStorage } from '~/helper/storage';
import TistoryClient from '~/tistory/TistoryClient';
import TistoryError from '~/tistory/TistoryError';
import { TistoryPluginSettings } from '~/types';
import { PublishConfirmModal, TistoryPublishOptions } from '~/ui/PublishConfirmModal';
import TistorySettingTab, { DEFAULT_SETTINGS } from '~/ui/TistorySettingsTab';

export default class TistoryPlugin extends Plugin {
  #settings: TistoryPluginSettings | null;
  #tistoryClient: TistoryClient | null;

  constructor(app: App, manifest: PluginManifest) {
    super(app, manifest);
    this.#settings = null;
    this.#tistoryClient = null;
  }

  get settings() {
    return this.#settings!;
  }

  get tistoryClient() {
    return this.#tistoryClient!;
  }

  createTistoryClient(accessToken: string | null | undefined) {
    if (accessToken) {
      this.#tistoryClient = new TistoryClient(accessToken);
    }
  }

  logout() {
    TistoryAuthStorage.clearTistoryAuthInfo();
    this.#tistoryClient = null;
  }

  async onload() {
    console.log('Loading Tistory Plugin');

    await this.loadSettings();

    this.addCommand({
      id: 'publish',
      name: 'Publish to Tistory',
      callback: () => {
        this.publishTistory();
      },
    });

    // This adds a settings tab so the user can configure various aspects of the plugin
    this.addSettingTab(new TistorySettingTab(this));

    const accessToken = TistoryAuthStorage.getAccessToken();
    if (accessToken) {
      this.createTistoryClient(accessToken);
    }
  }

  onunload() {}

  async loadSettings() {
    this.#settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.#settings);
  }

  async publishTistory() {
    if (!this.#tistoryClient) {
      new Notice('티스토리 설정에서 [인증하기] 버튼을 눌러주세요.');
      return;
    }

    const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!activeView || !activeView.file) {
      new Notice('열려있는 노트가 없습니다. 파일을 열고 다시 시도해주세요.'); // No file is open/active. Please open a file and try again.
      return;
    }

    const fileContent = await this.app.vault.cachedRead(activeView.file);
    if (fileContent !== activeView.data) {
      new Notice('파일의 변경사항이 저장되지 않았습니다. 파일을 저장하고 다시 시도해주세요.');
      return;
    }

    try {
      // get frontmatter in fileContent
      const fileCache = this.app.metadataCache.getFileCache(activeView.file);
      const frontmatter = fileCache?.frontmatter;
      const frontmatterPosition = fileCache?.frontmatterPosition;
      const markdown = fileContent.slice(frontmatterPosition?.end.offset ?? 0).trim();
      const tags = parseFrontMatterTags(frontmatter)
        ?.map((tag) => tag.replace(/^#/, ''))
        ?.join(',');

      const tistoryPublishOptions: TistoryPublishOptions = {
        tistoryBlogName: frontmatter?.tistoryBlogName || TistoryAuthStorage.getDefaultBlogId() || '',
        tistoryVisibility: frontmatter?.tistoryVisibility ?? '0',
        tistoryCategory: frontmatter?.tistoryCategory,
        tistoryTitle: frontmatter?.tistoryTitle || frontmatter?.title || activeView.file.basename,
        tistoryTags: frontmatter?.tistoryTags || tags,
        tistoryPostId: frontmatter?.tistoryPostId,
        tistorySkipModal: frontmatter?.tistorySkipModal,
        tistoryPublished: frontmatter?.tistoryPublished,
      };

      const html = await new Publisher(this).generateHtml(markdown, activeView.file);

      // 모달창 오픈하지 않기 옵션이 활성화되어 있는 경우
      if (tistoryPublishOptions.tistorySkipModal) {
        this.publishPost(html, activeView.file, tistoryPublishOptions);
        return;
      }

      new PublishConfirmModal(this, tistoryPublishOptions, async (publishOptions) => {
        this.publishPost(html, activeView.file!, publishOptions);
      }).open();
    } catch (error) {
      new Notice((error as Error).toString());
    }
  }

  async publishPost(html: string, file: TFile, options: TistoryPublishOptions) {
    try {
      if (!this.#tistoryClient) {
        throw new Error('티스토리 설정에서 [인증하기] 버튼을 눌러주세요.');
      }

      new Notice('티스토리에 글을 업로드합니다.');

      const { postId, url } = await this.#tistoryClient.writeOrModifyPost({
        blogName: options.tistoryBlogName,
        postId: options.tistoryPostId,
        title: options.tistoryTitle,
        visibility: options.tistoryVisibility,
        category: options.tistoryCategory,
        tag: options.tistoryTags,
        content: html,
        ...(options.tistoryPublished && {
          published: `${Math.floor(new Date(options.tistoryPublished).getTime() / 1000)}`,
        }),
      });

      await this.updateFile(file, {
        tistoryBlogName: options.tistoryBlogName,
        tistoryTitle: options.tistoryTitle,
        tistoryTags: options.tistoryTags,
        tistoryVisibility: options.tistoryVisibility,
        tistoryCategory: options.tistoryCategory,
        tistorySkipModal: options.tistorySkipModal,
        tistoryPublished: options.tistoryPublished,
        tistoryPostId: postId,
        tistoryPostUrl: url,
      });

      new Notice('티스토리에 글이 업로드되었습니다.');
    } catch (err) {
      console.warn(err);
      if (err instanceof TistoryError && err.message === '게시글 정보가 존재하지 않습니다.') {
        new Notice(`${err.message}(postId=${options.tistoryPostId})`);
      } else {
        new Notice((err as Error).toString());
      }
    }
  }

  async updateFile(file: TFile, addFrontMatter: Record<string, string | number | boolean | undefined>): Promise<void> {
    const fileContent = await this.app.vault.read(file);
    const fileCache = this.app.metadataCache.getFileCache(file);
    const cachedFrontMatter = { ...fileCache?.frontmatter };
    const frontMatterPosition = fileCache?.frontmatterPosition;

    const hasCachedFrontMatter = Object.keys(cachedFrontMatter).length > 0;

    const contentBody = hasCachedFrontMatter
      ? fileContent.slice((frontMatterPosition?.end.offset ?? 0) + 1)
      : fileContent;

    const newFrontMatter = {
      ...cachedFrontMatter,
      ...addFrontMatter,
    };
    // newFrontMatter의 값이 없는 경우, 해당 키를 삭제한다.
    Object.keys(newFrontMatter).forEach((key) => {
      if (!newFrontMatter[key]) {
        delete newFrontMatter[key];
      }
    });
    const newFileContent = `---\n${stringifyYaml(newFrontMatter)}---\n${contentBody}`;
    return await this.app.vault.modify(file, newFileContent);
  }
}
