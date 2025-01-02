"server only"
import React from 'react'
import Image from 'next/image'

import {cn} from '@/lib/utils'
import Link from '@/components/link'
import { NarrowPageBody } from '@/components/narrow-body'

import ShareButton from './share-button'
import {Author} from './post-author'

import authors from '@/data/authors.json'
import threadsInfo from '@/content-idx/threads.json'
import { fileURLToPath } from 'url'

import contentIndex from '@/content-idx/index.json'

export const PostPage = ({children})=>(
	<NarrowPageBody className="grid grid-cols-12 md:pt-4 md:pl-0 lg:pr-0">
		{children}
	</NarrowPageBody>
)

export function PostCover({cover}){
	if (!cover) return null
	return (
		<div className="max-w-prose mx-auto row-start-1 col-start-1 col-span-12 md:col-start-4 md:col-span-9 lg:col-start-4 lg:col-span-6">
			<Image src={cover} alt="cover"/>
		</div>
	)
}
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

export const PostBody = ({className,children})=>(
	<div className={cn(
		"mx-4 md:mx-0",
		"row-start-3",
		"   col-start-1    col-span-12",
		"md:col-start-4 md:col-span-9",
		"lg:col-start-4 lg:col-span-6"
	)}>
		<div className={cn("max-w-prose mx-auto", className)}>
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

function ThreadPost({ current, post, lang }) {
	const langPost = post[lang] ?? post[0]
	const title = langPost?.title ?? "post.slug"

	if (current?.sitepath === post.sitepath) {
		return <span className="font-bold">{title}</span>
	}

	return (
		<Link href={post.sitepath}>{title}</Link>
	)
}

export function PostThreadposts({lang,current}) {
	const {thread} = current
	if (!thread) return null

	const threadPosts = (
		contentIndex
		.filter( a=>a.thread===current.thread)
		.sort((a,b)=> a.date.localeCompare(b.date))
	)
	if (!threadPosts.length) return null

	return (
		<div className={cn(
			"mx-4 md:mx-0 mb-4",
			"   row-start-7    col-start-1     col-span-12",
			"md:row-start-7 md:col-start-4  md:col-span-9",
			"lg:row-start-3 lg:col-start-10 lg:col-span-3"
		)}>
			<h3>{threadsInfo[thread]?.title??thread}</h3>
			<ol className='ml-5 text-xs list-decimal list-outside'>
			{threadPosts.map( post=>(
				<li className="my-2" key={post.sitepath}>
					<ThreadPost current={current} post={post} lang={lang}/>
				</li>
			))}
			</ol>
		</div>
	)
}
PostPage.Threadposts = PostThreadposts

function SubpostTitle({title,lang}) {
	if (!title) return null

	let text = null
	if (typeof title === 'string') text = title
	else text = title[lang] || title['en'] || title['fr']

	return <h2 className="mt-4">{text}</h2>
}

async function Subposts({title,src,sitepath,lang}) {
	if (!src) return null

	const pageBase = sitepath+'/'
	const slugStart = pageBase.length
	
	const subPages = (
		contentIndex
		.map( p=>{
			if (!p.sitepath.startsWith(pageBase)) return null
			const slug = p.sitepath.substring(slugStart)
			if (slug.indexOf('/')>=0) return null

			const meta = p[lang] ?? p[0]

			return {
				slug,
				title: meta?.title ?? slug,
				sitepath: p.sitepath
			}
		})
		.filter(a=>!!a)
	)
	if (!subPages.length) return null

	return (
		<div className='markdown'> 
			<SubpostTitle title={title} lang={lang}/>
			<ul>
			{subPages.map( page => (
				<li key={page.slug}>
					<Link href={page.sitepath}>{page.title}</Link>
				</li>
			) )}
			</ul>
		</div>
	)		
}

function getFrontmatter(postdata,LANG) {
	const langMatter = postdata[`matter${LANG}`] ?? postdata.matter ?? {}
	const {date,author,thread} = postdata
	return {
		date,
		author,
		thread,
		...langMatter
	}
}

export async function Post({postdata, lang="", children}) {
	const LANG = lang.toUpperCase()
	const matter = getFrontmatter(postdata, LANG)
	const cover = postdata.cover
	const Content = postdata[`Content${LANG}`] ?? postdata.Content
	const canonicalURL = `https://jmuffat.com/todo` 

	const src = fileURLToPath(postdata.src)
	const current = contentIndex.find( a=>a.src===src)

	return (
		<PostPage>
			<PostCover cover={cover}/>
			<PostTitle>{matter.title}</PostTitle>
			<PostBody>
				<div className="markdown">
					<Content/>
				</div>
				{children}
				<Subposts title={postdata.subpostsTitle} src={postdata.src} sitepath={current.sitepath} lang={lang}/>
				<ShareButton className="my-8" title={matter.title} text={matter.excerpt} url={canonicalURL} />
			</PostBody>
			<PostAuthor author={authors[matter.author]} date={new Date(matter.date)}/>
			<PostThreadposts lang={lang} current={current}/>
		</PostPage>
	)
}

export function genPostPage(postdata){
	const res = (
		async ({params})=> {
			const {lang} = await params
			return <Post lang={lang} postdata={postdata}/>
		}
	)

	res.displayName = "GeneratedPostPage"
	return res
}

export function PostPageMetadata(postdata) {
	const src = fileURLToPath(postdata.src)
	const meta = contentIndex.find( a=>a.src===src)

	return (
		async ({ params }) => {
			const { lang } = await params
			const isEn = lang === 'en'
			const LANG = lang.toUpperCase()
			const matter = postdata[`matter${LANG}`] ?? postdata.matter ?? {}
		
			const published = postdata.matter?.date? new Date(postdata.matter.date) : undefined

			return {
				alternates: {
					canonical: meta.sitepath,
					languages: {
						'en-GB': `/en${meta.sitepath}`,
						'fr-FR': `/fr${meta.sitepath}`,
					},
				},
		
				title: matter?.title ?? 'jmuffat.com',
				description: isEn ?
					  'random ideas, by Jérôme Muffat-Méridol'
					: 'idées en vrac, par Jérôme Muffat-Méridol',
				openGraph: {
					type: 'website',
					siteName: "jmuffat.com",
					title: matter?.title,
					url: meta.sitepath,
					locale: isEn? 'en-GB' : 'fr-FR',
					publishedTime: published
				}
			}
		}
	)
}


