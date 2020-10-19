import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router'
import matter from 'gray-matter'

import BasePage from './base-page';
import Markdown from './markdown';
import ShareButton from './share-button';
import {getPost, getAllPosts} from '~/lib/compile-posts';

import authors from '~/data/authors.json'

function getCoverImage(post) {
  const cover = post.coverImage
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
            {author.facebook && <SocialButton href={author.facebook}          fa_id="fab fa-facebook" color="#1877f2"/>}
            {author.linkedin && <SocialButton href={author.linkedin}          fa_id="fab fa-linkedin" color="#2867B2"/>}
            {author.reddit   && <SocialButton href={author.reddit}            fa_id="fab fa-reddit"   color="#FF5700"/>}
          </div>
          <div className="date">{props.date}</div>
        </div>
    </div>
  );
}

export function PostPage(props) {

  const { data, content } = matter(props.md)

  const post = {
    ...data,
    slug:props.slug
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
        {/*<meta property="og:image:width" content="1024" />
        <meta property="og:image:height" content="768" />*/}
      </Head>

      {coverImage && (
        <div className="cover">
          <img src={coverImage}/>
        </div>
      )}

      <div className="title">
        <h1>{post.title}</h1>
      </div>

      <div className="content">
        <Markdown md={content}/>
        <ShareButton title={post.title} text={post.excerpt} url={canonicalURL} />
      </div>

      <Author author={author} date={strDate}/>

      <div className="more">
        {/*More posts...*/}
      </div>
    </BasePage>
  );
}
