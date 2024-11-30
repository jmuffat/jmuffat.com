"server only"
import path from 'path'
import React from 'react'
import Image from 'next/image'
import Link from '@/components/link'

import ShareButton from './share-button'
import {Author} from './post-author'

import { NarrowPageBody } from '@/components/narrow-body'

import ImageSize from 'image-size'

import authors from '@/data/authors.json'
import threads from '@/data/threads.json'

function ThreadPost(props) {
	const { current, post } = props

	if (current.slug === post.slug) {
		return <span><strong>{post.title}</strong></span>
	}

	return (
		<span><Link href={`./${post.slug}`}>{post.title}</Link></span>
	)
}

function postHasThread(post) {
	const { threadPosts } = post
	return threadPosts && threadPosts.length != 0
}

function Thread(props) {
	const { post } = props
	if (!postHasThread(post)) return null;

	const { threadPosts } = post
	const title = threads[post.thread]?.title || post.thread || 'Thread'

	return (
		<>
			<h3>{title}</h3>
			<ol>
				{threadPosts.map(a => <li key={a.slug}><ThreadPost current={post} post={a} /></li>)}
			</ol>
		</>
	)
}

function calcCoverSize(cover) {
	if (!cover) return

	const cwd = process.cwd()
	const coverPath = path.join(cwd, 'public', cover)

	const size = ImageSize(coverPath)
	return {
		w: size.width,
		h: size.height
	}
}


function CoverImage({ cover, post }) {
	if (cover) return <Image src={cover} alt="cover"/>

	if (!post.coverImage) return null;

	const coverSize = calcCoverSize(post.coverImage)
	const maxAspect = 1080 / 1920
	const aspect = coverSize.h / coverSize.w

	if (aspect < maxAspect) {
		return (
			<Image src={post.coverImage} width={coverSize.w} height={coverSize.h} alt="cover" />
		)
	}

	const ratio = maxAspect / aspect

	return (
		<Image style={{ width: `${100 * ratio}%` }} src={post.coverImage} width={coverSize.w} height={coverSize.h} alt="cover" />
	)
}

function OldPost({
	className="markdown",
	cover,
	metadata={}, 
	slug, 
	threadPosts, 

	children
}) {
	const locale = 'en'

	const post = {
		...metadata,
		slug: slug,
		threadPosts: threadPosts
	};

	const date = new Date(post.date)
	const options = { year: 'numeric', month: 'long', day: 'numeric' }
	const strDate = date.toLocaleDateString(locale, options)

	const author = authors[post.author]
	const postPath = post.path || '/posts/'
	const canonicalURL = `https://jmuffat.com${postPath}${post.slug}`

	return (
		<NarrowPageBody className="grid grid-cols-12 md:pt-4 md:pl-0 lg:pr-0">
			
			<div className="row-start-1 col-start-1 col-span-12 md:col-start-4 md:col-span-9 lg:col-start-4 lg:col-span-6">
				<CoverImage cover={cover} post={post} />
			</div>

			<div className="mr-4 ml-4 md:ml-0 row-start-2 col-start-1 col-span-12 md:col-start-4 md:col-span-9 lg:col-start-4 lg:col-span-6">
				<div className="max-w-prose mx-auto">
					<h1 className="mt-8 mb-4 pb-3 text-2xl">{post.title}</h1>
				</div>
			</div>

			<div className="mr-4 ml-4 md:ml-0 row-start-3 col-start-1 col-span-12 md:col-start-4 md:col-span-9 lg:col-start-4 lg:col-span-6">
				<div className="max-w-prose mx-auto">
					<div className={className}>
					{children}
					</div>
					<ShareButton className="my-8" title={post.title} text={post.excerpt} url={canonicalURL} />
				</div>
			</div>

			<Author className='row-start-4 col-start-1 col-span-12 md:row-start-3 md:col-start-1 md:col-span-3 p-4' author={author} date={strDate} />

			{postHasThread(post) && (
				<div className="row-start-3 col-start-10 col-span-3">
					<Thread post={post} />
				</div>
			)}
		</NarrowPageBody>
	);
}


export const PostPage = ({children})=>(
	<NarrowPageBody className="grid grid-cols-12 md:pt-4 md:pl-0 lg:pr-0">
		{children}
	</NarrowPageBody>
)

export const PostCover = ({cover})=>(
	<div className="row-start-1 col-start-1 col-span-12 md:col-start-4 md:col-span-9 lg:col-start-4 lg:col-span-6">
		<Image src={cover} alt="cover"/>
	</div>
)
PostPage.Cover = PostCover

export function PostTitle({children}){
	if (!children) return null
	return (
		<div className="mr-4 ml-4 md:ml-0 row-start-2 col-start-1 col-span-12 md:col-start-4 md:col-span-9 lg:col-start-4 lg:col-span-6">
			<div className="max-w-prose mx-auto">
				<h1 className="mt-8 mb-4 pb-3 text-2xl">{children}</h1>
			</div>
		</div>
	)
}
PostPage.Title = PostTitle

export const PostBody = ({children})=>(
	<div className="mr-4 ml-4 md:ml-0 row-start-3 col-start-1 col-span-12 md:col-start-4 md:col-span-9 lg:col-start-4 lg:col-span-6">
		<div className="max-w-prose mx-auto">
			{children}
		</div>
	</div>
)
PostPage.Body = PostBody

export function PostAuthor({author,date}){
	return (
		<Author className='row-start-4 col-start-1 col-span-12 md:row-start-3 md:col-start-1 md:col-span-3 p-4' author={author} date={date} />
	)
}
PostPage.Author = PostAuthor

export const PostSubposts = ({children})=>(
	<div className="row-start-3 col-start-10 col-span-3">
		{children}
	</div>
)

export function Post({postdata, lang="", children}) {
	const LANG = lang.toUpperCase()
	const matter = postdata[`matter${LANG}`] ?? postdata.matter ?? {}
	const cover = postdata[`cover${LANG}`] ?? postdata.cover
	const Content = postdata[`Content${LANG}`] ?? postdata.Content
	const canonicalURL = `https://jmuffat.com/todo` 

	return (
		<PostPage>
			<PostCover cover={cover}/>
			<PostTitle>{matter.title}</PostTitle>
			<PostBody>
				<div className="markdown">
					<Content/>
				</div>
				{children}
				<ShareButton className="my-8" title={matter.title} text={matter.excerpt} url={canonicalURL} />
			</PostBody>
			<PostAuthor/>
			<PostSubposts/>
		</PostPage>
	)
}

export const genPostPage = (postdata)=>(
	async ({params})=> {
		const {lang} = await params
		return <Post lang={lang} postdata={postdata}/>
	}
)

export default OldPost
