/* eslint-disable @typescript-eslint/no-explicit-any */
import { App, arrayBufferToBase64, getLinkpath, Notice, TFile } from 'obsidian';
import { markdownToHtml } from './markdown';

export default class Publisher {
  frontmatterRegex = /^\s*?---\n([\s\S]*?)\n---/g;
  codeFenceRegex = /`(.*?)`/g;
  codeBlockRegex = /```.*?\n[\s\S]+?```/g;
  excaliDrawRegex = /:\[\[(\d*?,\d*?)\],.*?\]\]/g;

  constructor(private readonly app: App) {}

  async generateHtml(file: TFile): Promise<string> {
    const frontMatter = this.app.metadataCache.getFileCache(file)?.frontmatter;
    const fileContent = await app.vault.cachedRead(file);
    let result = fileContent.slice(frontMatter?.position?.end.offset ?? 0);
    result = await this.removeObsidianComments(result);
    result = await this.renderDataViews(result);
    result = await this.renderLinksToFullPath(result, file.path);
    result = await this.createBase64Images(result, file.path);
    result = markdownToHtml(result);
    return result;
  }

  removeObsidianComments(content: string) {
    return content.replace(/^\n?%%(.+?)%%\n?$/gms, '');
  }

  async renderDataViews(text: string) {
    const dataViewRegex = /```dataview(.+?)```/gms;
    const matches = text.matchAll(dataViewRegex);
    if (!matches) return text;

    let result = text.toString();
    for (const queryBlock of matches) {
      try {
        const block = queryBlock[0];
        const query = queryBlock[1];
        const markdown = await (window as any).DataviewAPI?.tryQueryMarkdown(query);
        result = result.replace(block, markdown);
      } catch (e) {
        console.log(e);
        new Notice('Unable to render dataview query. Please update the dataview plugin to the latest version.');
        return queryBlock[0];
      }
    }
    return result;
  }

  stripAwayCodeFences(text: string): string {
    let result = text.toString();
    result = result.replace(this.excaliDrawRegex, '');
    result = result.replace(this.codeBlockRegex, '');
    result = result.replace(this.codeFenceRegex, '');
    return result;
  }

  async renderLinksToFullPath(text: string, filePath: string): Promise<string> {
    let result = text.toString();

    const textToBeProcessed = this.stripAwayCodeFences(text);

    const linkedFileRegex = /\[\[(.*?)\]\]/g;
    const linkedFileMatches = textToBeProcessed.match(linkedFileRegex);

    if (linkedFileMatches) {
      for (const linkMatch of linkedFileMatches) {
        try {
          const textInsideBrackets = linkMatch.substring(linkMatch.indexOf('[') + 2, linkMatch.lastIndexOf(']') - 1);
          let [linkedFileName, prettyName] = textInsideBrackets.split('|');

          prettyName = prettyName || linkedFileName;
          let headerPath = '';
          if (linkedFileName.includes('#')) {
            const headerSplit = linkedFileName.split('#');
            linkedFileName = headerSplit[0];
            //currently no support for linking to nested heading with multiple #s
            headerPath = headerSplit.length > 1 ? `#${headerSplit[1]}` : '';
          }
          const fullLinkedFilePath = getLinkpath(linkedFileName);
          const linkedFile = this.app.metadataCache.getFirstLinkpathDest(fullLinkedFilePath, filePath);
          if (!linkedFile) {
            result = result.replace(linkMatch, `[[${linkedFileName}${headerPath}|${prettyName}]]`);
          }
          if (linkedFile?.extension === 'md') {
            const extensionlessPath = linkedFile.path.substring(0, linkedFile.path.lastIndexOf('.'));
            result = result.replace(linkMatch, `[[${extensionlessPath}${headerPath}|${prettyName}]]`);
          }
        } catch (e) {
          console.log(e);
          continue;
        }
      }
    }

    return result;
  }

  getExtension(linkedFile: TFile) {
    //Markdown-it will not recognize jpg images. But putting png as the extension makes it work for some reason.
    if (linkedFile.extension === 'jpg' || linkedFile.extension === 'jpeg') return 'png';
    return linkedFile.extension;
  }

  async createBase64Images(text: string, filePath: string): Promise<string> {
    let imageText = text;
    const transcludedImageRegex = /!\[\[(.*?)(\.(png|jpg|jpeg|gif))\|(.*?)\]\]|!\[\[(.*?)(\.(png|jpg|jpeg|gif))\]\]/g;
    const transcludedImageMatches = text.match(transcludedImageRegex);
    if (transcludedImageMatches) {
      for (let i = 0; i < transcludedImageMatches.length; i++) {
        try {
          const imageMatch = transcludedImageMatches[i];
          const [imageName, size] = imageMatch
            .substring(imageMatch.indexOf('[') + 2, imageMatch.indexOf(']'))
            .split('|');
          const imagePath = getLinkpath(imageName);
          const linkedFile = this.app.metadataCache.getFirstLinkpathDest(imagePath, filePath);
          if (linkedFile) {
            const image = await this.app.vault.readBinary(linkedFile);
            const imageBase64 = arrayBufferToBase64(image);
            const name = size ? `${imageName}|${size}` : imageName;
            const imageMarkdown = `![${name}](data:image/${this.getExtension(linkedFile)};base64,${imageBase64})`;
            imageText = imageText.replace(imageMatch, imageMarkdown);
          }
        } catch {
          continue;
        }
      }
    }

    const imageRegex = /!\[(.*?)\]\((.*?)(\.(png|jpg|jpeg|gif))\)/g;
    const imageMatches = text.match(imageRegex);
    if (imageMatches) {
      for (let i = 0; i < imageMatches.length; i++) {
        try {
          const imageMatch = imageMatches[i];
          const nameStart = imageMatch.indexOf('[') + 1;
          const nameEnd = imageMatch.indexOf(']');
          const imageName = imageMatch.substring(nameStart, nameEnd);
          const pathStart = imageMatch.lastIndexOf('(') + 1;
          const pathEnd = imageMatch.lastIndexOf(')');
          const imagePath = imageMatch.substring(pathStart, pathEnd);
          if (imagePath.startsWith('http')) {
            continue;
          }
          const linkedFile = this.app.metadataCache.getFirstLinkpathDest(imagePath, filePath);
          if (linkedFile) {
            const image = await this.app.vault.readBinary(linkedFile);
            const imageBase64 = arrayBufferToBase64(image);
            const imageMarkdown = `![${imageName}](data:image/${this.getExtension(linkedFile)};base64,${imageBase64})`;
            imageText = imageText.replace(imageMatch, imageMarkdown);
          }
        } catch {
          continue;
        }
      }
    }

    return imageText;
  }
}
