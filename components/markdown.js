import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
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
    <Link href={href} target="_blank">
        <Image src="/img/Download_on_the_App_Store_Badge_US-UK_RGB_blk_092917.svg" alt="download on App Store" unoptimized/>
    </Link>
  )
}

function rewriteLink(href,children) {
  const simpleLabel = children 

  // special cases
  if (typeof simpleLabel ==='string') {
    switch (simpleLabel) {
      case '@youtube': return embedYoutube(href)
      case '@appstore': return embedAppStore(href)
      case '@react': return embedComponent(href)
    }
  }

  if (/^\/download\//.test(href)) {
    return <Link locale={false} href={href} target="_blank">{children}</Link>
  }

  if (href.indexOf('//') < 0) {
    // this is a local link, leave as is
    return <Link href={href}>{children}</Link>
  }
  else {
    // this is an external link, add target="_blank"
    return <Link href={href} target="_blank">{children}</Link>
  }
}

function rewriteHeader(a,scripts) {
  if (a.node.tagName=="h6") {
    const componentName = a?.children
    if (typeof componentName === 'string') {
      return React.createElement(scripts[componentName])
    }
  }

  return createElement(a.node.tagname, null, a.children)
}

function rewriteCode({inline,className,children}) {
  const language = className?.replace(/^language-/,'')

  if (!language || inline) {
    return <code>{children}</code>
  }

  console.log({language})
  const customStyle = {
    fontSize: "0.75em"
  }

  return (
    <SyntaxHighlighter
      language={language}
      customStyle={customStyle}
    >
      {children}
    </SyntaxHighlighter>
  )
}

function Markdown(props) {
  const components = {
    a: a=>rewriteLink(a.href,a.children),
    h6: a=>rewriteHeader(a,props.script),
    code: a=>rewriteCode(a)
  }

  return (
    <ReactMarkdown components={components}>
    {props.md}
    </ReactMarkdown>
  )
}

export default Markdown;
