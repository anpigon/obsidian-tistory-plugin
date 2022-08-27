import { ItemView, SplitDirection, WorkspaceLeaf } from "obsidian";
import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";

import TistoryPlugin from "../TistoryPlugin";
import TistoryPosts from "./components/TistoryPosts";
import TistoryPostView from "./TistoryPostView";

export const VIEW_TYPE = "tistory-posts-view";
export const VIEW_DISPLAY_TEXT = "Tistory";
export const ICON = "strikethrough-glyph";

export class TistoryPostsView extends ItemView {
	constructor(leaf: WorkspaceLeaf, private readonly plugin: TistoryPlugin) {
		super(leaf);
	}

	getViewType(): string {
		return VIEW_TYPE;
	}

	getDisplayText(): string {
		return VIEW_DISPLAY_TEXT;
	}

	getIcon(): string {
		return ICON;
	}

	async onOpen() {
		const root = createRoot(this.containerEl.children[1]);
		root.render(
			<div className="tistory-plugin-view">
				<TistoryPosts tistoryPostsView={this} plugin={this.plugin} />
			</div>
		);
	}

	async onClose() {
		ReactDOM.unmountComponentAtNode(this.containerEl.children[1]);
	}
}
