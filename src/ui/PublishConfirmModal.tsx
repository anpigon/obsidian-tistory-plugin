import { Modal, TFile } from 'obsidian';
import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { TistoryAuthStorage } from '~/helper/storage';
import { UpdatePostParams } from '~/tistory/types';

import TistoryPlugin from '~/TistoryPlugin';
import PublishConfirm, { PostOptions } from '~/ui/components/PublishConfirm';

export class PublishConfirmModal extends Modal {
  #root: Root | null;
  #options: PostOptions;

  constructor(
    private readonly plugin: TistoryPlugin,
    private readonly file: TFile,
    private callback: (postParams: UpdatePostParams) => void,
  ) {
    super(plugin.app);

    const options = { ...this.app.metadataCache.getFileCache(this.file)?.frontmatter } as PostOptions;
    this.#options = {
      tistoryBlogName: options?.tistoryBlogName || TistoryAuthStorage.getDefaultBlogId() || '',
      tistoryVisibility: options?.tistoryVisibility,
      tistoryCategory: options?.tistoryCategory,
      tistoryTitle: options?.tistoryTitle || options?.title || this.file.basename,
      tistoryTag: options?.tistoryTag || options?.tag,
      tistoryPostId: options?.tistoryPostId,
    };
  }

  handlePublish(postParams: UpdatePostParams) {
    this.callback({
      postId: this.#options.tistoryPostId,
      blogName: postParams.blogName,
      title: postParams.title,
      visibility: postParams.visibility,
      category: postParams.category,
    });
    this.close();
  }

  async onOpen() {
    const { contentEl, titleEl } = this;
    contentEl.empty();

    titleEl.createEl('h2', { text: '티스토리 글 발행' });

    if (!this.#root) {
      this.#root = createRoot(contentEl);
    }

    this.#root.render(
      <PublishConfirm
        plugin={this.plugin}
        blogName={this.#options.tistoryBlogName}
        options={this.#options}
        onClose={() => this.close()}
        onPublish={(postParams: UpdatePostParams) => this.handlePublish(postParams)}
      />,
    );
  }

  onClose() {
    const { contentEl } = this;
    this.#root?.unmount();
    this.#root = null;
    contentEl.empty();
  }
}
