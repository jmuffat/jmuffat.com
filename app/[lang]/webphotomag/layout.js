import React from 'react'
import Post from '@/components/post'
import {matter} from './page.mdx'

function Page({children}) {
	console.log(matter)
	return (
		<Post locales={["fr"]} metadata={matter}>
			<div className="markdown">
				{children}
			</div>
		</Post>
	)
}

export default Page;

