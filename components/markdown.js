import React from 'react';
import MarkdownIt from 'markdown-it';
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
