import React from 'react'
import Link from 'next/link'
import matter from 'gray-matter'

import BasePage from '~/components/base-page'
import Post from '~/components/post'
import {getAllPosts} from '~/lib/compile-posts'
import {coverSize} from '~/lib/post-utils'

import md from '~/data/content/pzview/index.md'

function page(props) {
  return (
    <Post md={md} coverSize={props.coverSize}>
      <h2>News</h2>
      {props.posts.map(post=>{
        const date = new Date(post.date)
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
        const strDate = date.toLocaleDateString('en-us',options)

        return <p key={post.slug}><small>{strDate}</small> <Link href={`/${props.folder}/${post.slug}`}><a>{post.title}</a></Link></p>
      })}
    </Post>
  );
}

export default page;


export async function getStaticProps( {params} ) {
  const folder = 'pzview'
  const posts = getAllPosts(folder,['slug', 'title', 'date','thread'])
  const parsedMD = matter(md)

  return {
    props: {
      folder,
      posts,
      coverSize: coverSize(parsedMD)
    },
  }
}
