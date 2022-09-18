import { App, TFile } from 'obsidian';

export const openFile = (props: { file: TFile; app: App; isNewLeaf: boolean }) => {
  const { file, app, isNewLeaf } = props;
  const leaf = app.workspace.getLeaf(isNewLeaf);
  app.workspace.setActiveLeaf(leaf, false);
  leaf.openFile(file, { eState: { focus: true } });
};

export const openFileInNewPane = (app: App, file: TFile) => {
  openFile({ file: file, app: app, isNewLeaf: true });
};

export const removeObsidianComments = (content: string) => {
  return content.replace(/^\n?<!--(.+?)-->\n?$/gms, '').replace(/^\n?%%(.+?)%%\n?$/gms, '');
};
