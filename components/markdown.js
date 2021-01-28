import React from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import ReactMarkdown from 'react-markdown'

// Only load syntax highlighter when necessary
const SyntaxHighlighter = dynamic(() =>
  import('react-syntax-highlighter').then((mod) => mod.Prism)
)

function reduceChildren(children, child) {
    var lastIndex = children.length - 1;
    if (typeof child === 'string' && typeof children[lastIndex] === 'string') {
        children[lastIndex] += child;
    } else {
        children.push(child);
    }

    return children;
}

function createElement(tagName, props, children) {
    var nodeChildren = Array.isArray(children) && children.reduce(reduceChildren, []);
    var args = [tagName, props].concat(nodeChildren || children);
    return React.createElement.apply(React, args);
}

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

function rewriteHeader(a,scripts) {
  if (a.level==6) {
    const node = a?.children[0]?.props?.node
    if (node && node.type==="text") {
      const componentName = a.children[0].props.node.value.trim()
      return React.createElement(scripts[componentName])
    }
  }

  return createElement('h' + a.level, null, a.children)
}

function rewriteCode(props) {
  const {language,value} = props

  const customStyle = {
    fontSize: "0.75em"
  }

  return (
    <SyntaxHighlighter
      language={language}
      children={value}
      customStyle={customStyle}
    />
  )
}

function Markdown(props) {
  const renderers = {
    link: a=>rewriteLink(a.href,a.children),
    heading: a=>rewriteHeader(a,props.script),
    code: a=>rewriteCode(a)
  }

  return (
    <ReactMarkdown renderers={renderers}>
    {props.md}
    </ReactMarkdown>
  )
}

export default Markdown;
