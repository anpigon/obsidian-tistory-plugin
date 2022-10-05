/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-var-requires */
// ref: https://github.com/markdown-it/markdown-it
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({
  breaks: true,
  html: true,
  linkify: true,
  typographer: true,
})
  .use(require('markdown-it-mark'))
  .use(require('markdown-it-footnote'))
  .use(require('markdown-it-mathjax3'), {
    tex: {
      inlineMath: [['$', '$']],
    },
    options: {
      skipHtmlTags: { '[-]': ['pre'] },
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
/* .use(function (md) {
    md.renderer.rules.fence = function (tokens, idx, options, env, slf) {
      console.log('fence', { tokens, idx, options, env, slf });
      const token = tokens[idx];
      if (token.info === 'dataview') {
        const code = token.content.trim();
        const result =  (window as any).DataviewAPI?.tryQueryMarkdown(code);
        console.log(result);
        if (result) {
          return result;
        }
      }
      return slf.renderToken(tokens, idx, options);
    };
  }); */

export function markdownToHtml(markdown: string) {
  return md.render(markdown);
}
