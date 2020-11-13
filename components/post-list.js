import React from 'react'
import Link from 'next/link'

function Post(props){
  const {post,folder} = props

  const date = new Date(post.date)
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' }
  const strDate = date.toLocaleDateString('en-us',options)

  return (
    <p>
      <small>{strDate}</small>&nbsp;
      <Link href={`/${folder}/${post.slug}`}>
        <a>{post.title}</a>
      </Link>
    </p>
  )
}

function PostList(props) {
  return props.posts.map( post=> {
    return <Post key={post.slug} folder={props.folder} post={post} />
  })
}

export default PostList
