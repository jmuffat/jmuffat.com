import React from 'react'
import Post from '@/components/post'
import {metadata} from './page.mdx'

function Page({children}) {
	return (
		<Post locales={["fr"]} metadata={metadata}>
			<div className="markdown">
				{children}
			</div>
		</Post>
	)
}

export default Page;

