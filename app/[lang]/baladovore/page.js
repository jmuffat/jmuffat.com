import React from 'react'

import Post from '@/components/post'

import md from './baladovore.mdx'

function Page(props) {
  return (
    <Post content={md} coverSize={props.coverSize} locales={["fr-FR"]}>
    {/*
      <h2>News</h2>
      <PostList {...props}/>
    */}
    </Post>
  );
}

export default Page;

