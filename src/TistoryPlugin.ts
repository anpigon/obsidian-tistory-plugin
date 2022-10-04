import { MarkdownView, Notice, Plugin, stringifyYaml } from 'obsidian';

import { TistoryPluginSettings } from '~/types';
import TistoryClient from '~/tistory/TistoryClient';
import TistorySettingTab, { DEFAULT_SETTINGS } from '~/ui/TistorySettingsTab';
import { TistoryAuthStorage } from '~/helper/storage';
import { PublishConfirmModal } from '~/ui/PublishConfirmModal';
import { UpdatePostParams, UpdatePostResponse } from './tistory/types';
import { PostOptions } from '~/ui/components/PublishConfirmModal';
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

    this.createTistoryClient(TistoryAuthStorage.loadTistoryAuthInfo()?.accessToken);
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
      new Notice('티스토리 인증이 필요합니다.');
      return;
    }

    const activeView = this.app.workspace.getActiveViewOfType(MarkdownView);
    if (!activeView) {
      new Notice('열려있는 노트가 없습니다.');
      return;
    }

    const fileContent = await app.vault.cachedRead(activeView.file);
    if (fileContent !== activeView.data) {
      new Notice('파일을 저장하고 다시 시도해주세요.');
      return;
    }

    try {
      const frontMatter = { ...this.app.metadataCache.getFileCache(activeView.file)?.frontmatter };
      const content = fileContent.slice(frontMatter.position?.end.offset ?? 0);
      delete frontMatter.position;

      const tistoryAuthInfo = TistoryAuthStorage.loadTistoryAuthInfo();
      const postOptions = frontMatter as PostOptions;
      const blogName = postOptions?.tistoryBlogName || tistoryAuthInfo?.selectedBlog || '';
      const options = {
        tistoryVisibility: postOptions?.tistoryVisibility,
        tistoryCategory: postOptions?.tistoryCategory,
        tistoryTitle: postOptions?.tistoryTitle || postOptions?.title || activeView.file.basename,
        tistoryTag: postOptions?.tistoryTag || postOptions?.tag,
      } as PostOptions;

      new PublishConfirmModal(this, blogName, options, async (result) => {
        const publisher = new Publisher(this.app);
        const addPostParams = {
          blogName: result.tistoryBlogName,
          title: result.tistoryTitle || options.tistoryTitle,
          visibility: result.tistoryVisibility,
          category: result.tistoryCategory,
          content: await publisher.generateHtml(content, activeView.file.path),
          ...(postOptions?.tistoryPostId && { postId: postOptions.tistoryPostId }),
        } as UpdatePostParams;

        try {
          let response: UpdatePostResponse;
          if (postOptions?.tistoryPostId) {
            // 기존 글 수정
            response = await this.#tistoryClient.modifyPost(addPostParams);
          } else {
            // 글 새로 등록
            response = await this.#tistoryClient.writePost(addPostParams);
          }

          const newFrontMatter = {
            ...frontMatter,
            tistoryBlogName: addPostParams.blogName,
            tistoryTitle: addPostParams.title,
            tistoryVisibility: addPostParams.visibility,
            tistoryCategory: addPostParams.category,
            tistoryPostId: response.postId,
            tistoryPostUrl: response.url,
          };
          const newFileContent = `---\n${stringifyYaml(newFrontMatter)}---${content}`;
          await this.app.vault.modify(activeView.file, newFileContent);
          new Notice(`티스토리에 글이 발행되었습니다.`);
        } catch (err) {
          console.warn(err);
          if (err instanceof TistoryError && err.message === '게시글 정보가 존재하지 않습니다.') {
            new Notice(`${err.message}(postId=${postOptions?.tistoryPostId})`);
          } else {
            new Notice((err as Error).toString());
          }
        }
      }).open();
    } catch (error) {
      new Notice((error as Error).toString());
    }
  }
}
