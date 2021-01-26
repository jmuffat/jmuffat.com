import React from 'react'
import Link from 'next/link'

import BasePage from '~/components/base-page'
import Post from '~/components/post'
import PostList from '~/components/post-list'

import md from '~/data/content/webphotomag/index.md'

function Page(props) {
  return (
    <Post content={md} coverSize={props.coverSize}>
      <h2>Les numéros</h2>
      <PostList {...props}/>
    </Post>
  );
}

export default Page;

// -=-=-=-=-=-=-=-=-
import {getStaticPropsForPost} from '~/lib/post-utils'

export async function getStaticProps( {params} ) {
  const props = getStaticPropsForPost('webphotomag', md)

  return {props}
}
