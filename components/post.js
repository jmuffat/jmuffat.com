"server only"
import path from 'path'
import React from 'react';
import Image from 'next/image'
import matter from 'gray-matter'
import Link from '@/components/link'

import {Markdown} from './markdown2';
import ShareButton from './share-button';

import {NarrowPageBody} from '@/components/narrow-body'

import ImageSize from 'image-size'

import authors from '@/data/authors.json'
import threads from '@/data/threads.json'

function getCoverImage(post) {
  const cover = post.coverImage || post._coverImage
  if (!cover) return null;

  const url = new URL(cover, 'https://jmuffat.com')
  return url.href
}

function SocialButton(props) {
  return (
    <a href={props.href} target="_blank"> <i className={props.fa_id} style={{color:props.color}}></i> </a>
  )
}

function Author(props) {
  let author = props.author;
  if (!author) return null;

  return (
    <div className="author">
        <Image src={author.img} unoptimized alt="portrait" width="128" height="128"/>
        <div>
          <div className="name">{author.name}</div>
          <div className="social">
            {author.email    && <SocialButton href={`mailto:${author.email}`} fa_id="fas fa-at"       color="#111111"/>}
            {author.github   && <SocialButton href={author.github}            fa_id="fab fa-github"   color="#000000"/>}
            {author.facebook && <SocialButton href={author.facebook}          fa_id="fab fa-facebook" color="#1877f2"/>}
            {author.linkedin && <SocialButton href={author.linkedin}          fa_id="fab fa-linkedin" color="#2867B2"/>}
            {author.reddit   && <SocialButton href={author.reddit}            fa_id="fab fa-reddit"   color="#FF5700"/>}
          </div>
          <div className="date" suppressHydrationWarning>{props.date}</div>
        </div>
    </div>
  );
}

function ThreadPost(props) {
  const {current,post} = props

  if (current.slug===post.slug) {
    return <span><strong>{post.title}</strong></span>
  }

  return (
    <span><Link href={`./${post.slug}`}>{post.title}</Link></span>
  )
}

function postHasThread(post) {
  const {threadPosts} = post
  return threadPosts && threadPosts.length!=0
}

function Thread(props) {
  const {post} = props
  if (!postHasThread(post)) return null;

  const {threadPosts} = post
  const title = threads[post.thread]?.title || post.thread || 'Thread'

  return (
    <>
      <h3>{title}</h3>
      <ol>
      {threadPosts.map(a=><li key={a.slug}><ThreadPost current={post} post={a}/></li>)}
      </ol>
    </>
  )
}

function HistoricMetadata(props) {
  const metadata = props.metadata?.historicMetadata
  if (!metadata) return null;

  return (
    <>
      <h3>Metadata</h3>
      <code>
        <ul>
        {Object.keys(metadata).map((item,idx)=>(
          <li key={idx}>{item} : {metadata[item]}</li>
        ))}
        </ul>
      </code>
    </>
  )
}

function calcCoverSize(cover) {
  if (!cover) return

  const cwd = process.cwd()
  const coverPath = path.join(cwd,'public',cover)

  const size = ImageSize(coverPath)
  return {
    w: size.width,
    h: size.height
  }
}


function CoverImage({post}) {
  if (!post.coverImage) return null;

  const coverSize = calcCoverSize(post.coverImage)
  const maxAspect = 1080/1920
  const aspect = coverSize.h/coverSize.w

  if (aspect < maxAspect) {
    return (
      <Image src={post.coverImage} width={coverSize.w} height={coverSize.h} alt="cover"/>
    )
  }

  const ratio = maxAspect / aspect

  return (
      <Image style={{width:`${100*ratio}%`}} src={post.coverImage} width={coverSize.w} height={coverSize.h} alt="cover"/>
  )
}

function PostPage(props) {
  const { data, content } = matter(props.content)
  const locale = 'en'

  const post = {
    ...data,
    slug:props.slug,
    threadPosts:props.threadPosts
  };

  const date = new Date(post.date)
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  const strDate = date.toLocaleDateString(locale,options)

  const coverImage = getCoverImage(post)
  const author = authors[post.author]
  const postPath = post.path || '/posts/'
  const canonicalURL = `https://jmuffat.com${postPath}${post.slug}`

  return (
    <NarrowPageBody>

      <div className="max-w-prose mx-auto"> 
        <CoverImage post={post}/>
        <h1 className="mt-8 mb-4 pb-3 text-2xl">{post.title}</h1>
        <Markdown md={content} script={props.script}/>
        <HistoricMetadata metadata={data}/>
        {props.children}
        <ShareButton title={post.title} text={post.excerpt} url={canonicalURL} />
      </div>

      <Author author={author} date={strDate}/>

      {postHasThread(post) && (
        <div className="more">
          <Thread post={post} />
        </div>
      )}
    </NarrowPageBody>
  );
}

export default PostPage
