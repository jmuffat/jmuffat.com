import React from 'react'
import Link from 'next/link'

import BasePage from '@/components/base-page'
import Post from '@/components/post'
import PostList from '@/components/post-list'

import md from '@/data/content/pzview/index.md'

function Page(props) {
  return (
    <Post content={md} coverSize={props.coverSize}  locales={["en-US"]}>
      <h2>News</h2>
      <PostList {...props}/>
    </Post>
  );
}

export default Page;


// -=-=-=-=-=-=-=-=-
import {getStaticPropsForPost} from '@/lib/post-utils'

export async function getStaticProps( {params} ) {
  const props = getStaticPropsForPost('pzview', md)

  return {props}
}
