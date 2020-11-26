import React from 'react';
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

function embedYoutube(href) {
  const embedURL = `https://www.youtube-nocookie.com/embed/${href}?rel=0`;
  // const pageURL  = `https://www.youtube.com/watch?v=${videoID}`;
  // const imageURL = `https://img.youtube.com/vi/${videoID}/0.jpg`

  return (
    <div className="embed-responsive embed-responsive-16by9">
      <iframe
        className="embed-responsive-item youtube-player"
        type="text/html"
        width={640}
        height={390}
        src={embedURL}
        frameBorder="0"
        allowFullScreen>
      </iframe>
    </div>
  )
}

function embedAppStore(appId) {
  const href = `https://apps.apple.com/${appId}`

  return (
    <Link href={href}>
      <a target="_blank">
        <img src="/img/Download_on_the_App_Store_Badge_US-UK_RGB_blk_092917.svg"/>
      </a>
    </Link>
  )
}

function embedComponent(src) {
  const Component = require(`./${src}`).default
  return <Component/>
}

function rewriteLink(href,children) {
  const simpleLabel = children ? children[0].props?.children : null

  // special cases
  if (typeof simpleLabel ==='string') {
    switch (simpleLabel) {
      case '@youtube': return embedYoutube(href)
      case '@appstore': return embedAppStore(href)
      case '@react': return embedComponent(href)
    }
  }

  if (href.indexOf('//') < 0) {
    // this is a local link, leave as is
    return <Link href={href}><a>{children}</a></Link>
  }
  else {
    // this is an external link, add target="_blank"
    return <Link href={href}><a target="_blank">{children}</a></Link>
  }
}

const renderers = {
  link: a=>rewriteLink(a.href,a.children)
}

function Markdown(props) {
  return (
    <ReactMarkdown renderers={renderers}>
    {props.md}
    </ReactMarkdown>
  )
}

export default Markdown;
