/* eslint-disable @typescript-eslint/no-unused-vars */
import { Notice, TFile } from 'obsidian';
import React, { useEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';

import TistoryPlugin from '~/TistoryPlugin';
import { TistoryPostsView } from '~/ui/TistoryPostsView';
import useIntersectObserver from '~/ui/hooks/useIntersectObserver';
import TistoryPostView from '../TistoryPostView';
import { Post, PostDetail } from '~/tistory/types';

export const List = styled.div``;
export const ellipsisMixin = css`
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const ListTile = styled.div`
  &:hover {
    background-color: var(--background-secondary-alt);
    color: var(--text-normal);
  }
`;

const NavFile: React.FC<{
  title: string;
  onClick(): void;
}> = ({ title, onClick }) => {
  // --> AuxClick (Mouse Wheel Button Action)
  const onAuxClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // if (e.button === 1) Util.openFileInNewPane(plugin.app, file);
  };

  // Handle Right Click Event on File - Custom Menu
  const triggerContextMenu = (file: TFile, e: React.MouseEvent | React.TouchEvent) => {
    // const fileMenu = new Menu(plugin.app);

    // Pin - Unpin Item
    /* fileMenu.addItem((menuItem) => {
			menuItem.setIcon("pin");
			if (pinnedFiles.contains(file)) menuItem.setTitle("Unpin");
			else menuItem.setTitle("Pin to Top");
			menuItem.onClick((ev: MouseEvent) => {
				if (pinnedFiles.contains(file)) {
					let newPinnedFiles = pinnedFiles.filter(
						(pinnedFile) => pinnedFile !== file
					);
					setPinnedFiles(newPinnedFiles);
				} else {
					setPinnedFiles([...pinnedFiles, file]);
				}
			});
		}); */

    // Rename Item
    /* fileMenu.addItem((menuItem) => {
			menuItem.setTitle("Rename");
			menuItem.setIcon("pencil");
			menuItem.onClick((ev: MouseEvent) => {
				let vaultChangeModal = new VaultChangeModal(
					plugin,
					file,
					"rename"
				);
				vaultChangeModal.open();
			});
		}); */

    // Delete Item
    /* fileMenu.addItem((menuItem) => {
			menuItem.setTitle("Delete");
			menuItem.setIcon("trash");
			menuItem.onClick((ev: MouseEvent) => {
				let deleteOption = plugin.settings.deleteFileOption;
				if (deleteOption === "permanent") {
					plugin.app.vault.delete(file, true);
				} else if (deleteOption === "system-trash") {
					plugin.app.vault.trash(file, true);
				} else if (deleteOption === "trash") {
					plugin.app.vault.trash(file, false);
				}
			});
		}); */

    // Open in a New Pane
    /* 		fileMenu.addItem((menuItem) => {
			menuItem.setIcon("go-to-file");
			menuItem.setTitle("Open in a new pane");
			menuItem.onClick((ev: MouseEvent) => {
				Util.openFileInNewPane(plugin.app, file);
			});
		}); */

    // Make a Copy Item
    /* fileMenu.addItem((menuItem) => {
			menuItem.setTitle("Make a copy");
			menuItem.setIcon("documents");
			menuItem.onClick((ev: MouseEvent) => {
				plugin.app.vault.copy(
					file,
					`${file.parent.path}/${file.basename} 1.${file.extension}`
				);
			});
		}); */

    // Move Item
    /* if (!Util.internalPluginLoaded("file-explorer", plugin.app)) {
			fileMenu.addItem((menuItem) => {
				menuItem.setTitle("Move file to...");
				menuItem.setIcon("paper-plane");
				menuItem.onClick((ev: MouseEvent) => {
					let fileMoveSuggester = new MoveSuggestionModal(
						plugin.app,
						file
					);
					fileMoveSuggester.open();
				});
			});
		} */

    // Trigger
    /* plugin.app.workspace.trigger(
			"file-menu",
			fileMenu,
			file,
			"file-explorer"
		);
		if (isMouseEvent(e)) {
			fileMenu.showAtPosition({ x: e.pageX, y: e.pageY });
		} else {
			// @ts-ignore
			fileMenu.showAtPosition({
				x: e.nativeEvent.locationX,
				y: e.nativeEvent.locationY,
			});
		} */
    return false;
  };

  const mouseEnteredOnFile = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, file: TFile) => {
    /* if (plugin.settings.filePreviewOnHover && (e.ctrlKey || e.metaKey)) {
			plugin.app.workspace.trigger(
				"link-hover",
				{},
				e.target,
				file.path,
				file.path
			);
		} */
  };

  return (
    <div
      className="nav-file"
      onClick={onClick}
      // onClick={(e) => openFile(file, e)}
      // onContextMenu={(e) => triggerContextMenu(file, e)}
      // onMouseEnter={(e) => mouseEnteredOnFile(e, file)}
      // onAuxClick={onAuxClick}
    >
      <div className="nav-file-title">
        <div className="nav-file-title-content">{title}</div>
      </div>
    </div>
  );
};

interface Props {
  tistoryPostsView: TistoryPostsView;
  plugin: TistoryPlugin;
}

const TistoryPosts: React.FC<Props> = (props) => {
  // --> Main Variables
  const { plugin } = props;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const currentPage = useRef<number>(1);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    console.log('render');
    fetchNextPage(1);
  }, []);

  const fetchNextPage = async (page: number) => {
    if (plugin.tistoryClient) {
      setIsFetching(true);
      try {
        const response = await plugin.tistoryClient.getPosts('anpigon', page);
        if (response) {
          const totalCount = parseInt(response.totalCount, 10);
          const currentTotalCount = posts.length + response.posts.length;
          currentPage.current = parseInt(response.page, 10);
          setHasNextPage(currentTotalCount < totalCount);
          setPosts((prev) => {
            return [...prev, ...response.posts];
          });
        }
      } catch (error) {
        new Notice(error.toString());
      } finally {
        setIsFetching(false);
        setIsLoading(false);
      }
    }
  };

  const ref = useIntersectObserver(async (entry, observer) => {
    observer.unobserve(entry.target);
    if (hasNextPage && !isFetching) {
      fetchNextPage(currentPage.current + 1);
    }
  });

  const handleClick = async (id: string) => {
    console.log(`click: ${id}`);
    const post = await plugin.tistoryClient.getPost('anpigon', id);
    if (post) {
      openNewView(plugin, post);
    }
  };

  return (
    <React.Fragment>
      {posts.map((item) => (
        <NavFile key={item.id} title={item.title} onClick={() => handleClick(item.id)} />
      ))}
      <div className="scrollingObserver" ref={ref} />
    </React.Fragment>
  );
};

export default TistoryPosts;

const openNewView = (plugin: TistoryPlugin, post: PostDetail) => {
  const { workspace } = plugin.app;
  const leaf = workspace.getLeaf();
  /* if (leaf.view instanceof FileView) {
		// 새 탭으로 열기
		const newLeaf = workspace.createLeafBySplit(leaf, "vertical");
		// leaf.setGroupMember(newLeaf);
		newLeaf.open(new TistoryPostView(newLeaf, plugin, post));
		return;
	} */
  // 기존 탭에 열기
  // const postView = new TistoryPostView(leaf, plugin, post);
  // leaf.open(postView);

  // const newLeaf = workspace.createLeafBySplit(leaf);
  // leaf.setGroupMember(newLeaf);
  const view = new TistoryPostView(leaf, plugin, post);
  // view.setViewData(post.content, true);
  leaf.open(view);
  // console.log(view.getViewType(), view.getMode());
};
