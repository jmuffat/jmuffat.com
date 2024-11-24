import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

function Post(props){
  const router = useRouter()
  const {post,folder} = props

  const date = new Date(post.date)
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
  const strDate = date.toLocaleDateString(router.locale,options)

  return (
    <p>
      <small suppressHydrationWarning>{strDate}</small>&nbsp;
      <Link href={`/${folder}/${post.slug}`}>{post.title}</Link>
    </p>
  )
}

function PostList(props) {
  return props.posts.map( post=> {
    return <Post key={post.slug} folder={props.folder} post={post} />
  })
}

export default PostList
