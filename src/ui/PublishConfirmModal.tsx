import { Modal } from 'obsidian';
import React from 'react';
import { createRoot } from 'react-dom/client';

import ReactDOM from 'react-dom';
import { UpdatePostParams } from '~/tistory/types';
import TistoryPlugin from '~/TistoryPlugin';
import PublishConfirm from '~/ui/components/PublishConfirm';

export interface TistoryPublishOptions {
  tistoryBlogName: UpdatePostParams['blogName'];
  tistoryVisibility: UpdatePostParams['visibility'];
  tistoryCategory: UpdatePostParams['category'];
  tistoryTitle: UpdatePostParams['title'];
  tistoryTags: UpdatePostParams['tag'];
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
    titleEl.createEl('h2', { text: '티스토리 글 발행' });
    contentEl.classList.add('tistory');
    createRoot(contentEl).render(
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
    ReactDOM.unmountComponentAtNode(contentEl);
    contentEl.empty();
  }
}
