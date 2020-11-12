import React from 'react'
import Link from 'next/link'
import BasePage from '~/components/base-page'
import Post from '~/components/post'
import {getAllPosts} from '~/lib/compile-posts'

import md from '~/data/content/webphotomag/index.md'

function page(props) {
  return (
    <Post md={md} coverSize={{w:512,h:362}}>
      <h2>Les numéros</h2>
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
  const folder = 'webphotomag'
  const posts = getAllPosts(folder,['slug', 'title', 'date'])

  return {
    props: {
      folder,
      posts
    },
  }
}
