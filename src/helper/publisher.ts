/* eslint-disable @typescript-eslint/no-explicit-any */
import { arrayBufferToBase64, getLinkpath, Notice, TFile } from 'obsidian';
import TistoryPlugin from '~/TistoryPlugin';
import { markdownToHtml } from './markdown';

export default class Publisher {
  frontmatterRegex = /^\s*?---\n([\s\S]*?)\n---/g;
  codeFenceRegex = /`(.*?)`/g;
  codeBlockRegex = /```.*?\n[\s\S]+?```/g;
  excaliDrawRegex = /:\[\[(\d*?,\d*?)\],.*?\]\]/g;

  constructor(private readonly plugin: TistoryPlugin) {}

  async generateHtml(markdown: string, file: TFile): Promise<string> {
    let result = markdown;
    if (this.plugin.settings.blogFooter) {
      result += `\n${this.plugin.settings.blogFooter}`;
    }
    result = this.removeObsidianComments(result);
    result = await this.renderDataViews(result);
    result = await this.renderLinksToFullPath(result, file.path);
    result = await this.createBase64Images(result, file.path);
    result = markdownToHtml(result, {
      useMathjax: this.plugin.settings.useMathjax,
    });
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
          if (linkedFileName.includes('#')) {
            const headerSplit = linkedFileName.split('#');
            linkedFileName = headerSplit[0];
          }
          const linkedFile = this.plugin.app.metadataCache.getFirstLinkpathDest(getLinkpath(linkedFileName), filePath);
          if (!linkedFile) {
            // 내부 파일 링크가 없는 경우 prettyName만 표시한다.
            result = result.replace(linkMatch, prettyName);
          }
          if (linkedFile?.extension === 'md') {
            const frontmatter = this.plugin.app.metadataCache.getFileCache(linkedFile)?.frontmatter;
            if (frontmatter && 'tistoryPostUrl' in frontmatter) {
              const { tistoryPostUrl, tistoryTitle } = frontmatter;
              result = result.replace(linkMatch, `<a href="${tistoryPostUrl}">${tistoryTitle || prettyName}</a>`);
            } else {
              // 내부 파일 링크가 tistoryPostUrl이 없는 경우 prettyName만 표시한다.
              result = result.replace(linkMatch, prettyName);
            }
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

  async readImageBase64(file: TFile) {
    return arrayBufferToBase64(await this.plugin.app.vault.readBinary(file));
  }

  async createBase64Images(text: string, filePath: string): Promise<string> {
    let result = text;
    const transcludedImageMatches =
      text.match(/!\[\[(.*?)(\.(png|jpg|jpeg|gif))\|(.*?)\]\]|!\[\[(.*?)(\.(png|jpg|jpeg|gif))\]\]/g) ?? [];
    for (const imageMatch of transcludedImageMatches) {
      try {
        const [imageName, size] = imageMatch.substring(imageMatch.indexOf('[') + 2, imageMatch.indexOf(']')).split('|');
        const linkedFile = this.plugin.app.metadataCache.getFirstLinkpathDest(getLinkpath(imageName), filePath);
        if (linkedFile) {
          const imageBase64 = await this.readImageBase64(linkedFile);
          const name = size ? `${imageName}|${size}` : imageName;
          const imageMarkdown = `![${name}](data:image/${this.getExtension(linkedFile)};base64,${imageBase64})`;
          result = result.replace(imageMatch, imageMarkdown);
        }
      } catch {
        continue;
      }
    }
    const imageMatches = text.match(/!\[(.*?)\]\((.*?)(\.(png|jpg|jpeg|gif))\)/g) ?? [];

    for (const imageMatch of imageMatches) {
      try {
        const nameStart = imageMatch.indexOf('[') + 1;
        const nameEnd = imageMatch.indexOf(']');
        const imageName = imageMatch.substring(nameStart, nameEnd);
        const pathStart = imageMatch.lastIndexOf('(') + 1;
        const pathEnd = imageMatch.lastIndexOf(')');
        const imagePath = imageMatch.substring(pathStart, pathEnd);
        if (imagePath.startsWith('http')) {
          const [alt, size] = imageName.split('|');
          if (size) {
            result = result.replace(imageMatch, `![${alt}](${imagePath}){width=${size}}`);
          }
        } else {
          const linkedFile = this.plugin.app.metadataCache.getFirstLinkpathDest(imagePath, filePath);
          if (linkedFile) {
            const imageBase64 = await this.readImageBase64(linkedFile);
            const imageMarkdown = `![${imageName}](data:image/${this.getExtension(linkedFile)};base64,${imageBase64})`;
            result = result.replace(imageMatch, imageMarkdown);
          }
        }
      } catch {
        continue;
      }
    }
    return result;
  }
}
