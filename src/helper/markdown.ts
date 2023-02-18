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

md.set({
  highlight: function (str, lang) {
    // Use your favorite code highlighting library here
    // and return the highlighted code wrapped in a <pre> tag
    const code = str.replace(/\n/g, '<br>\n').trimEnd();
    return `<pre class="${lang}" data-ke-language="${lang}"><code>${code}</code></pre>`;
  },
});

const containerClass = 'tt_article_useless_p_margin contents_style';

md.renderer.rules.fence = function (tokens, idx, options, env, self) {
  const token = tokens[idx];
  const lang = token.info.trim();
  const code = token.content;
  const content = md?.options?.highlight?.(code, lang, '');

  // Wrap the highlighted code in a <div> tag
  return `<div class="${containerClass}">${content}</div>`;
};

export function markdownToHtml(markdown: string) {
  return md.render(markdown);
}
