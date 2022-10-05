import { MarkdownView, Notice, Plugin, stringifyYaml, TFile } from 'obsidian';

import { TistoryPluginSettings } from '~/types';
import TistoryClient from '~/tistory/TistoryClient';
import TistorySettingTab, { DEFAULT_SETTINGS } from '~/ui/TistorySettingsTab';
import { TistoryAuthStorage } from '~/helper/storage';
import { PublishConfirmModal } from '~/ui/PublishConfirmModal';
import { UpdatePostResponse } from './tistory/types';
import TistoryError from './tistory/TistoryError';
import Publisher from './helper/publisher';

export default class TistoryPlugin extends Plugin {
  #settings: TistoryPluginSettings;
  #tistoryClient: TistoryClient;

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

    if (TistoryAuthStorage.getAccessToken()) {
      this.createTistoryClient(TistoryAuthStorage.getAccessToken());
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
      new PublishConfirmModal(this, activeView.file, async (postParams) => {
        try {
          const content = await new Publisher(this.app).generateHtml(activeView.file);
          const response: UpdatePostResponse = await this.#tistoryClient.writeOrModifyPost({
            ...postParams,
            content,
          });
          await this.updateFile(activeView.file, {
            tistoryBlogName: postParams.blogName,
            tistoryTitle: postParams.title,
            tistoryVisibility: postParams.visibility,
            tistoryCategory: postParams.category,
            tistoryPostId: response.postId,
            tistoryPostUrl: response.url,
          });
          new Notice(`티스토리에 글이 발행되었습니다.`);
        } catch (err) {
          console.warn(err);
          if (err instanceof TistoryError && err.message === '게시글 정보가 존재하지 않습니다.') {
            new Notice(`${err.message}(postId=${postParams.postId})`);
          } else {
            new Notice((err as Error).toString());
          }
        }
      }).open();
    } catch (error) {
      new Notice((error as Error).toString());
    }
  }

  async updateFile(file: TFile, addFrontMatter: Record<string, string | undefined>): Promise<void> {
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
