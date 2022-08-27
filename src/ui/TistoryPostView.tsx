import {
	WorkspaceLeaf,
	MarkdownView,
	ViewStateResult,
	TFile,
	Menu,
} from "obsidian";
import { Post, PostDetail } from "~/tistory/TistoryClient";

import TistoryPlugin from "~/TistoryPlugin";

export default class TistoryPostView extends MarkdownView {
	constructor(
		leaf: WorkspaceLeaf,
		private readonly plugin: TistoryPlugin,
		private readonly post: PostDetail
	) {
		super(leaf);
		this.setViewData(post.content, true);
	}

	getDisplayText() {
		console.log("getDisplayText", this.getViewType());
		return this.post.title;
	}

	async save(clear?: boolean): Promise<void> {
		console.log("save", clear);
	}

	// onload(): void {}
	onunload(): void {
		console.log("onunload");
	}
	// protected async onOpen(): Promise<void> {}
	// protected async onClose(): Promise<void> {}
	// async onLoadFile(file: TFile): Promise<void> {}
	// async onUnloadFile(file: TFile): Promise<void> {}
	// onPaneMenu(menu: Menu, source: string): void {}

	async setState(state: any, result: ViewStateResult): Promise<void> {
		super.setState(state, result);
		if (state.mode === "preview") {
			const previewEl = (this.previewMode as any).renderer.previewEl;
			// previewEl.innerHTML = `<div class="markdown-preview-view markdown-rendered is-readable-line-width">${this.getViewData()}</div>`;
			console.log((this.previewMode as any).renderer);
		}
	}

	// clear(): void {
	// 	console.log("clear");
	// }

	getViewType() {
		return "tistory_post_view";
	}
}
