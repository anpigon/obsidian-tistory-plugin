import { marked } from 'marked';

export function markdownToHtml(markdown: string) {
  // let content = markdown.replace(/\[\[(?:[^\]]+\|)?([^\]]+)\]\]/g, '$1');
  // content = markdown.replace(
  //   /[^"'(\\/](>)?(https?:\/\/(?:[-a-zA-Z0-9._]*[-a-zA-Z0-9])(?::\d{2,5})?(?:[/?#](?:[^\s"'<>\][()]*[^\s"'<>\][().,])?(?:(?:\.(?:tiff?|jpe?g|gif|png|svg|ico)|ipfs\/[a-z\d]{40,}))))/gi,
  //   `$1<img src="$2"/>`
  return marked.parse(markdown) ?? '';
}
