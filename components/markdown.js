import React from 'react';
import MarkdownIt from 'markdown-it';
import ContainerPlugin from 'markdown-it-container'
import Video from './mdit-video';

function rewriteLink(token) {
  const hrefAttr = token.attrs.find(a=>a[0]==='href')
  if (!hrefAttr) return;

  const href = hrefAttr[1]
  if (href.indexOf('//') < 0) {
    // this is a local link, leave as is
    return
  }

  // this is an external link, add target="_blank"
  token.attrPush(['target', '_blank']);
}

function Markdown(props) {
  const md = new MarkdownIt();

  md.use(Video, {
    acceptYoutube: true,
    youtube: { width: 640, height: 390, nocookie:true, parameters: {rel:0} },
    vimeo: { width: 500, height: 281 },
    vine: { width: 600, height: 600, embed: 'simple' },
    prezi: { width: 550, height: 400 }
  });

  md.use(ContainerPlugin, 'metadata', {
    validate: params => params.trim().match(/^metadata\s*(.*)$$/),
    render: (tokens, idx) => {
      const titleMatch = tokens[idx].info.trim().match(/^metadata\s+(.*)$/);
      const title = titleMatch? titleMatch[1] : 'Metadata'
      
      if (tokens[idx].nesting === 1) {
        // opening tag
        return `<div class="post-metadata"><h3>${title}</h3><code><pre>\n`;
      } else {
        // closing tag
        return '</pre></code></div>\n';
      }
    }
  });

  const old_render = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

  md.renderer.rules.link_open = (tokens, idx, options, env, self) => {
    rewriteLink(tokens[idx])
    return old_render(tokens, idx, options, env, self);
  };



  const markup = {__html: md.render(props.md)};

  return <div dangerouslySetInnerHTML={markup} />;
}

export default Markdown;
