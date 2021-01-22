import React from 'react'
import Link from 'next/link'
import BasePage from '~/components/base-page'
import {getAllPosts} from '~/lib/compile-posts'

import threads from '~/data/threads.json'

function Post(props) {
  const {post,folder} = props

  const date = new Date(post.date)
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
  const strDate = date.toLocaleDateString(props.locale,options)

  return (
    <>
      <span className="post-date">{strDate}</span>&nbsp;&nbsp;&nbsp;
      <Link href={`/${folder}/${post.slug}`}>
        <a>
          {post.title}
        </a>
      </Link>
    </>
  )
}

function Thread(props) {
  const {id, posts} = props
  const thread = threads[id]

  const sel = posts.filter(a=>a.thread===id)

  return (
    <>
      <h2>{thread.title}</h2>
      <ul>
      {sel.map(post=> <li key={post.slug}><Post post={post} folder={props.folder} locale={props.locale}/></li>)}
      </ul>
    </>
  )
}

function Uncategorized(props) {
  const sel = props.posts.filter(a=>!a.thread || !threads[a.thread])
  if (sel.length<1) return null;

  return (
    <>
      <h2>Uncategorized</h2>
      <ul>
      {sel.map(post=> <li key={post.slug}><Post post={post} folder={props.folder}/></li>)}
      </ul>
    </>
  )
}

function Page(props) {

  const dateThreads = props.posts.reduce(
    (cur,a)=>{
      if (a.thread && !cur[a.thread]) {
        // store first date found, as posts are sorted most recent first
        cur[a.thread] = a.date
      }
      return cur
    },
    {}
  )

  const sortProc = (a,b) => a.d<b.d? 1 : (a.d>b.d? -1 : 0);

  const sortedThreads = (
    Object.keys(dateThreads)
    .map(a=>( {n:a,d:dateThreads[a]} ))
    .sort(sortProc)
    .map( a=>a.n )
  )

  return (
    <BasePage title="Posts" extraClass="post-toc">
      <h1>Posts</h1>
      {sortedThreads.map(t=><Thread key={t} id={t} {...props}/>)}
      <Uncategorized {...props}/>
    </BasePage>
  )
}

export default Page


export async function getStaticProps( {params,locale} ) {
  const folder = 'posts'
  const posts = getAllPosts(folder,['slug', 'title', 'date', 'thread'])

  return {
    props: {
      folder,
      posts,
      locale
    },
  }
}
