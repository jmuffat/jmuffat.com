import React from 'react'
import Link from 'next/link'
import BasePage from '~/components/base-page'
import {getAllPosts} from '~/lib/compile-posts'

function page(props) {
  return (
    <BasePage title="Posts">
      <h1>Posts</h1>
      {props.posts.map(post=>{
        const date = new Date(post.date)
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' }
        const strDate = date.toLocaleDateString('en-us',options)

        return <p key={post.slug}><small>{strDate}</small> <Link href={`/${props.folder}/${post.slug}`}><a>{post.title}</a></Link></p>
      })}
    </BasePage>
  );
}

export default page;


export async function getStaticProps( {params} ) {
  const folder = 'posts'
  const posts = getAllPosts(folder,['slug', 'title', 'date'])

  return {
    props: {
      folder,
      posts
    },
  }
}
