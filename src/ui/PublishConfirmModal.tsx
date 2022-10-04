import { Modal } from 'obsidian';
import React from 'react';
import { createRoot, Root } from 'react-dom/client';

import TistoryPlugin from '~/TistoryPlugin';
import PublishConfirmModalView, { PostOptions } from '~/ui/components/PublishConfirm';

export class PublishConfirmModal extends Modal {
  #root: Root | null;

  constructor(
    private readonly plugin: TistoryPlugin,
    private readonly blogName: string,
    private readonly options: PostOptions,
    private callback: (result: PostOptions) => void,
  ) {
    super(plugin.app);
  }

  handlePublish(result: PostOptions) {
    this.callback(result);
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
      <PublishConfirmModalView
        plugin={this.plugin}
        blogName={this.blogName}
        options={this.options}
        onClose={() => this.close()}
        onPublish={(result: PostOptions) => this.handlePublish(result)}
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
