import { App, MarkdownView, Notice, Plugin, PluginManifest, stringifyYaml, TFile } from 'obsidian';

import { PublishConfirmModal, TistoryPublishOptions } from '~/ui/PublishConfirmModal';
import TistorySettingTab, { DEFAULT_SETTINGS } from '~/ui/TistorySettingsTab';
import Publisher from '~/helper/publisher';
import { TistoryAuthStorage } from '~/helper/storage';
import TistoryClient from '~/tistory/TistoryClient';
import TistoryError from '~/tistory/TistoryError';
import { TistoryPluginSettings } from '~/types';

export default class TistoryPlugin extends Plugin {
  #settings: TistoryPluginSettings;
  #tistoryClient: TistoryClient | null;

  constructor(app: App, manifest: PluginManifest) {
    super(app, manifest);
    this.#tistoryClient = null;
  }

  get settings() {
    return this.#settings;
  }

  get tistoryClient() {
    return this.#tistoryClient;
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
      id: 'tistory-publish',
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
    if (!activeView) {
      new Notice('열려있는 노트가 없습니다. 파일을 열고 다시 시도해주세요.'); // No file is open/active. Please open a file and try again.
      return;
    }

    const fileContent = await app.vault.cachedRead(activeView.file);
    if (fileContent !== activeView.data) {
      new Notice('파일의 변경사항이 저장되지 않았습니다. 파일을 저장하고 다시 시도해주세요.');
      return;
    }

    try {
      // get frontmatter in fileContent
      const frontmatter = {
        ...this.app.metadataCache.getFileCache(activeView.file)?.frontmatter,
      } as TistoryPublishOptions;

      const tistoryPublishOptions: TistoryPublishOptions = {
        tistoryBlogName: frontmatter?.tistoryBlogName || TistoryAuthStorage.getDefaultBlogId() || '',
        tistoryVisibility: frontmatter?.tistoryVisibility ?? '0',
        tistoryCategory: frontmatter?.tistoryCategory,
        tistoryTitle: frontmatter?.tistoryTitle || frontmatter?.title || activeView.file.basename,
        tistoryTag: frontmatter?.tistoryTag || frontmatter?.tag,
        tistoryPostId: frontmatter?.tistoryPostId,
        tistorySkipModal: frontmatter?.tistorySkipModal,
      };

      if (tistoryPublishOptions.tistorySkipModal) {
        this.publishPost(activeView.file, tistoryPublishOptions);
        return;
      }

      new PublishConfirmModal(this, tistoryPublishOptions, async (publishOptions) => {
        this.publishPost(activeView.file, publishOptions);
      }).open();
    } catch (error) {
      new Notice((error as Error).toString());
    }
  }

  async publishPost(file: TFile, options: TistoryPublishOptions) {
    if (!this.#tistoryClient) {
      new Notice('티스토리 설정에서 [인증하기] 버튼을 눌러주세요.');
      return;
    }

    try {
      new Notice('티스토리에 글을 업로드합니다.');

      const { postId: tistoryPostId, url: tistoryPostUrl } = await this.#tistoryClient.writeOrModifyPost({
        blogName: options.tistoryBlogName,
        postId: options.tistoryPostId,
        title: options.tistoryTitle,
        visibility: options.tistoryVisibility,
        category: options.tistoryCategory,
        tag: options.tistoryTag,
        content: await new Publisher(this.app).generateHtml(file),
      });

      await this.updateFile(file, {
        tistoryBlogName: options.tistoryBlogName,
        tistoryTitle: options.tistoryTitle,
        tistoryVisibility: options.tistoryVisibility,
        tistoryCategory: options.tistoryCategory,
        tistorySkipModal: options.tistorySkipModal,
        tistoryPostId,
        tistoryPostUrl,
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
    const cachedFrontMatter = { ...this.app.metadataCache.getFileCache(file)?.frontmatter };
    const fileContent = await app.vault.cachedRead(file);
    const contentBody = fileContent.slice(cachedFrontMatter?.position?.end.offset ?? 0);
    delete cachedFrontMatter.position;
    const newFrontMatter = {
      ...cachedFrontMatter,
      ...addFrontMatter,
    };
    const newFileContent = `---\n${stringifyYaml(newFrontMatter)}---${contentBody}`;
    return await this.app.vault.modify(file, newFileContent);
  }
}
