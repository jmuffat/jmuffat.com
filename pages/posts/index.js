import React from 'react'
import Link from 'next/link'
import BasePage from '~/components/base-page'
import {getAllPosts} from '~/lib/compile-posts'

import threads from '~/data/threads.json'

function Post(props) {
  const {post,folder} = props

  const date = new Date(post.date)
  const options = { year: 'numeric', month: 'numeric', day: 'numeric' }
  const strDate = date.toLocaleDateString('en-us',options)

  return (
    <>
      <small>{strDate}</small>&nbsp;
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
      {sel.map(post=> <li key={post.slug}><Post post={post} folder={props.folder}/></li>)}
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
  return (
    <BasePage title="Posts">
      <h1>Posts</h1>
      {Object.keys(threads).map(t=><Thread id={t} {...props}/>)}
      <Uncategorized {...props}/>
    </BasePage>
  )
}

export default Page


export async function getStaticProps( {params} ) {
  const folder = 'posts'
  const posts = getAllPosts(folder,['slug', 'title', 'date', 'thread'])

  return {
    props: {
      folder,
      posts
    },
  }
}
