import Post from '@/components/post'
import {matter} from './page.mdx'

function Page({children}) {
	return (
		<Post locales={["fr"]} metadata={matter}>
				{children}
		</Post>
	)
}

export default Page;

