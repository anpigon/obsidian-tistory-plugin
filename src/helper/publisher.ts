/* eslint-disable @typescript-eslint/no-explicit-any */
import { App, getLinkpath, Notice } from 'obsidian';
import { markdownToHtml } from './markdown';

export default class Publisher {
  frontmatterRegex = /^\s*?---\n([\s\S]*?)\n---/g;
  codeFenceRegex = /`(.*?)`/g;
  codeBlockRegex = /```.*?\n[\s\S]+?```/g;
  excaliDrawRegex = /:\[\[(\d*?,\d*?)\],.*?\]\]/g;

  constructor(private readonly app: App) {}

  async generateHtml(content: string, path: string): Promise<string> {
    let result = content.toString();
    result = await this.removeObsidianComments(result);
    result = await this.renderDataViews(result, path);
    result = await this.renderLinksToFullPath(result, path);
    result = markdownToHtml(result);
    return result;
  }

  removeObsidianComments(content: string) {
    return content.replace(/^\n?<!--(.+?)-->\n?$/gms, '').replace(/^\n?%%(.+?)%%\n?$/gms, '');
  }

  async renderDataViews(text: string, path: string) {
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
}
