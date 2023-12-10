import { App, TFile } from 'obsidian';

export const openFile = (props: { file: TFile; app: App; isNewLeaf: boolean }) => {
  const { file, app, isNewLeaf } = props;
  const leaf = app.workspace.getLeaf(isNewLeaf);
  app.workspace.setActiveLeaf(leaf, { focus: false });
  leaf.openFile(file, { eState: { focus: true } });
};

export const openFileInNewPane = (app: App, file: TFile) => {
  openFile({ file: file, app: app, isNewLeaf: true });
};

export const removeFrontmatter = (markdownContent: string) => {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  const match = markdownContent.match(frontmatterRegex);

  if (match) {
    // Extract frontmatter and remove it from the content
    const frontmatterString = match[0];
    const contentWithoutFrontmatter = markdownContent.replace(frontmatterRegex, '');

    return { frontmatterString, contentWithoutFrontmatter };
  } else {
    // No frontmatter found
    return { frontmatterString: '', contentWithoutFrontmatter: markdownContent };
  }
};
