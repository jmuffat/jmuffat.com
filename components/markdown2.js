// not using 'use client' so this can all be done server side (when applicable)
// import { useTheme } from 'next-themes'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark as dark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import rehypeSanitize from 'rehype-sanitize'
import rehypeExternalLinks from 'rehype-external-links'

import { cn } from '@/components/cn'

export function Markdown({ className, md, small, noLinks }) {
	const resolvedTheme = 'dark' // always use dark ()
	// const {resolvedTheme} = useTheme()

	function preHandler({ node, ...rest }) {
		const inner = node.children[0]
		if (inner && inner.tagName === 'code') {
			return <div {...rest} />
		}

		return <pre {...rest} />
	}

	// const LinkPreview = ({children})=><span className={cn("underline decoration-foreground/40")}>{children}</span>
	// const linkHandler = ({node, ...rest})=> noLinks? <LinkPreview {...rest}/> : <CardLink {...rest}/>

	function codeHandler({ children, className, node, ...rest }) {
		const match = /language-(\w+)/.exec(className ?? '')
		
		if (!match) return (
			<span className={cn('font-mono whitespace-pre text-xs',className)} {...rest} >
				{children}
			</span>
		)

		return (
			<div className="not-prose">
				<SyntaxHighlighter
					{...rest}
					PreTag="div"
					language={match?match[1]:null}
					style={dark}
				>
					{String(children).replace(/\n$/, '')}
				</SyntaxHighlighter>
			</div>
		)
	}

	if (!md) return null

	const remarkPlugins = [remarkGfm]
	const rehypePlugins = [
		rehypeSanitize,
		[rehypeExternalLinks, { target: '_blank' }],
	]

	const defaultComponents = {
		code: codeHandler,
		pre: preHandler
	}

	return (
		<ReactMarkdown
			className={cn(className,'prose break-words max-w-prose dark:prose-invert')}
			components={defaultComponents}
			remarkPlugins={remarkPlugins}
			rehypePlugins={rehypePlugins}
		>
			{md}
		</ReactMarkdown>
	)
}
