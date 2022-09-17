import { Editor, MarkdownView, Notice, Plugin, stringifyYaml } from 'obsidian';

import { TistoryPluginSettings } from '~/types';
import TistoryClient from '~/tistory/TistoryClient';
import { VIEW_TYPE } from '~/ui/TistoryPostsView';
import TistorySettingTab, { DEFAULT_SETTINGS } from '~/ui/TistorySettingsTab';
import { loadTistoryAuthInfo } from '~/helper/storage';
import { PublishConfirmModal } from '~/ui/PublishConfirmModal';
import { PostParams, WritePostResponse } from './tistory/types';
import { PostOptions } from './ui/components/PublicConfirmModalView';
import { markdownToHtml } from './helper/markdown';
import TistoryError from './tistory/TistoryError';

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

    // Register Tistory View
    // this.registerView(VIEW_TYPE, leaf => new TistoryPostsView(leaf, this));

    // Event Listeners
    // this.app.workspace.onLayoutReady(async () => {
    //   // if (this.settings.openViewOnStart) {
    //   await this.openTistoryLeaf(true);
    //   // }
    // });

    this.createTistoryClient(loadTistoryAuthInfo()?.accessToken);
  }

  openTistoryLeaf = async (showAfterAttach: boolean) => {
    const leafs = this.app.workspace.getLeavesOfType(VIEW_TYPE);
    if (leafs.length == 0) {
      // Needs to be mounted
      const leaf = this.app.workspace.getLeftLeaf(false);
      await leaf.setViewState({ type: VIEW_TYPE });
      if (showAfterAttach) this.app.workspace.revealLeaf(leaf);
    } else {
      // Already mounted - needs to be revealed
      leafs.forEach(leaf => this.app.workspace.revealLeaf(leaf));
    }
  };

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
      const frontMatter = this.app.metadataCache.getFileCache(activeView.file)?.frontmatter;
      const content = frontMatter
        ? fileContent
            .slice(frontMatter.position.end.offset)
            .replace(/^<!--.*-->$/ms, '')
            .trim()
        : fileContent;

      // TODO: blogName를 프론트메터에서도 가져오기
      const tistoryAuthInfo = loadTistoryAuthInfo();

      const postOptions = frontMatter as PostOptions;
      const blogName = postOptions?.blogName || tistoryAuthInfo?.selectedBlog || '';
      const options = {
        visibility: postOptions?.visibility,
        category: postOptions?.category,
        title: postOptions?.title || activeView.file.basename,
      } as PostOptions;

      new PublishConfirmModal(this, blogName, options, async result => {
        const params = {
          blogName,
          title: result.title || options.title,
          visibility: result.visibility || '0',
          category: result.category || '0',
          content: markdownToHtml(content),
          ...(postOptions?.postId && { postId: postOptions.postId }),
        } as PostParams;
        console.log(params);

        try {
          let response: WritePostResponse;
          if (postOptions?.postId) {
            // 기존 글 수정
            response = await this.#tistoryClient.modifyPost(params);
          } else {
            // 글 새로 등록
            response = await this.#tistoryClient.writePost(params);
          }

          const newFrontMatter = {
            ...frontMatter,
            blogName: params.blogName,
            title: params.title,
            visibility: params.visibility,
            category: params.category,
            postId: response.postId,
            url: response.url,
          };
          const newFileContent = `---\n${stringifyYaml(newFrontMatter)}---\n${content}`;
          await this.app.vault.modify(activeView.file, newFileContent);
          new Notice(`티스토리에 글이 발행되었습니다.`);
        } catch (err) {
          console.warn(err);
          if (err instanceof TistoryError && err.message === '게시글 정보가 존재하지 않습니다.') {
            new Notice(`${err.message}(postId=${postOptions?.postId})`);
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
