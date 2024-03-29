/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
// ref: https://github.com/markdown-it/markdown-it
import MarkdownIt from 'markdown-it';
import { escapeHtml } from 'markdown-it/lib/common/utils';
import { TistoryPluginSettings } from '~/types';

const md = MarkdownIt({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true,
  highlight(str, lang, attrs) {
    return (
      `<pre class="${lang}" data-ke-language="${lang}">` +
      `<code class="hljs" ${attrs}>` +
      escapeHtml(str) +
      `</code>` +
      `</pre>`
    );
  },
})
  .use(require('markdown-it-mark'))
  .use(require('markdown-it-footnote'))
  .use(require('markdown-it-attrs'))
  // https://github.com/tani/markdown-it-mathjax3/blob/master/index.ts
  .use(require('markdown-it-mathjax3'), {
    tex: {
      inlineMath: [['$', '$']],
    },
    options: {
      skipHtmlTags: { '[-]': ['pre', 'code'] },
    },
  })
  .use(require('markdown-it-task-checkbox'), {
    disabled: true,
    divWrap: false,
    divClass: 'checkbox',
    idPrefix: 'cbx_',
    ulClass: 'task-list',
    liClass: 'task-list-item',
  })
  .use(require('markdown-it-plantuml'), {
    openMarker: '```plantuml',
    closeMarker: '```',
  });

md.renderer.rules.hr = (tokens, idx, options, env, self) => {
  const token = tokens[idx];
  token.attrSet('contenteditable', 'false');
  token.attrSet('data-ke-type', 'horizontalRule');
  token.attrSet('data-ke-style', 'style6');
  return self.renderToken(tokens, idx, options);
};

export interface MarkdownToHtmlOptions extends MarkdownIt.Options, Pick<TistoryPluginSettings, 'useMathjax'> {
  skipHtmlTags?: { [key: string]: string[] };
}

export function markdownToHtml(markdown: string, options: MarkdownToHtmlOptions) {
  if (options.useMathjax) {
    md.enable(['math_block', 'math_inline']);
  } else {
    md.disable(['math_block', 'math_inline']);
  }
  return md.render(markdown);
}
