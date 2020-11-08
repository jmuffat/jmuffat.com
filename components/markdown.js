import React from 'react';
import MarkdownIt from 'markdown-it';
import Video from './mdit-video';

function Markdown(props) {
  const renderer = new MarkdownIt();

  renderer.use(Video, {
    acceptYoutube: true,
    youtube: { width: 640, height: 390, nocookie:true, parameters: {rel:0} },
    vimeo: { width: 500, height: 281 },
    vine: { width: 600, height: 600, embed: 'simple' },
    prezi: { width: 550, height: 400 }
  });

  const markup = {__html: renderer.render(props.md)};



  return <div dangerouslySetInnerHTML={markup} />;
}

export default Markdown;
