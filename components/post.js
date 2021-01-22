import React from 'react';
import Head from 'next/head';
import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from 'next/image'
import matter from 'gray-matter'

import BasePage from './base-page';
import Markdown from './markdown';
import ShareButton from './share-button';
import {getPost, getAllPosts} from '~/lib/compile-posts';

import authors from '~/data/authors.json'
import threads from '~/data/threads.json'

function getCoverImage(post) {
  const cover = post.coverImage || post._coverImage
  if (!cover) return null;

  const reURL = /https:\/\/.*/
  if (reURL.test(cover)) return cover;

  return `${process.env.NEXT_PUBLIC_FRONTEND_URL}${cover}`
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
        <img src={author.img} />
        <div>
          <div className="name">{author.name}</div>
          <div className="social">
            {author.email    && <SocialButton href={`mailto:${author.email}`} fa_id="fas fa-at"       color="#111111"/>}
            {author.github   && <SocialButton href={author.github}            fa_id="fab fa-github"   color="#000000"/>}
            {author.facebook && <SocialButton href={author.facebook}          fa_id="fab fa-facebook" color="#1877f2"/>}
            {author.linkedin && <SocialButton href={author.linkedin}          fa_id="fab fa-linkedin" color="#2867B2"/>}
            {author.reddit   && <SocialButton href={author.reddit}            fa_id="fab fa-reddit"   color="#FF5700"/>}
          </div>
          <div className="date">{props.date}</div>
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

function CoverImage(props) {
  const {post,coverSize} = props
  if (!post.coverImage) return null;

  const maxAspect = 1080/1920
  const aspect = coverSize.h/coverSize.w

  if (aspect < maxAspect) {
    return (
      <div className="cover">
        <Image className="cover-image" src={post.coverImage} width={coverSize.w} height={coverSize.h}/>
      </div>
    )
  }

  const ratio = maxAspect / aspect

  return (
    <div className="cover">
      <div style={{width:`${100*ratio}%`}}>
        <Image className="cover-image" src={post.coverImage} width={coverSize.w} height={coverSize.h}/>
      </div>
    </div>
  )
}

function PostPage(props) {

  const { data, content } = matter(props.md)

  const post = {
    ...data,
    slug:props.slug,
    threadPosts:props.threadPosts
  };

  const date = new Date(post.date)
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  const strDate = date.toLocaleDateString('en-us',options)

  const coverImage = getCoverImage(post)
  const author = authors[post.author]
  const postPath = post.path || '/posts/'
  const canonicalURL = `https://jmuffat.com${postPath}${post.slug}`

  return (
    <BasePage title={post.title} className="post-container">

      <Head>
        <meta property="og:type" content="article" />
        <meta property="article:author" content="https://www.facebook.com/jmuffat" />
        <meta property="og:title" content={post.title} />
        <link rel="canonical" href={canonicalURL} />
        <meta property="og:url" content={canonicalURL} />

        {post.excerpt && <meta property="og:description" content={post.excerpt} />}
        {coverImage && <meta property="og:image" content={coverImage} />}
        {coverImage && <meta property="og:image:secure_url" content={coverImage} />}
        {props.coverSize && <meta property="og:image:width"  content={props.coverSize.w} />}
        {props.coverSize && <meta property="og:image:height" content={props.coverSize.h} />}
      </Head>

      <CoverImage post={post} coverSize={props.coverSize}/>

      <div className="title">
        <h1>{post.title}</h1>
      </div>

      <div className="content">
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
    </BasePage>
  );
}

export default PostPage
