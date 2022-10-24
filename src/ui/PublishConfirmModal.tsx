import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Modal } from 'obsidian';

import PublishConfirm from '~/ui/components/PublishConfirm';
import TistoryPlugin from '~/TistoryPlugin';
import { UpdatePostParams } from '~/tistory/types';

export interface TistoryPublishOptions {
  tistoryBlogName: UpdatePostParams['blogName'];
  tistoryVisibility: UpdatePostParams['visibility'];
  tistoryCategory: UpdatePostParams['category'];
  tistoryTitle: UpdatePostParams['title'];
  tistoryTag: UpdatePostParams['tag'];
  tistoryPostId: UpdatePostParams['postId'];
  tistoryAcceptComment?: UpdatePostParams['acceptComment'];
  tistoryPublished?: UpdatePostParams['published'];
  tistorySlogan?: UpdatePostParams['slogan'];
  tistoryPostUrl?: string;
  tistorySkipModal: boolean;
  title?: string;
  tag?: string;
}

export class PublishConfirmModal extends Modal {
  #root: Root | null;

  constructor(
    private readonly plugin: TistoryPlugin,
    private readonly options: TistoryPublishOptions,
    private callback: (tistoryPublishOptions: TistoryPublishOptions) => void,
  ) {
    super(plugin.app);
  }

  handlePublish(tistoryPublishOptions: TistoryPublishOptions) {
    this.callback(tistoryPublishOptions);
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
        blogName={this.options.tistoryBlogName}
        options={this.options}
        onClose={() => this.close()}
        onPublish={(result) => this.handlePublish(result)}
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
