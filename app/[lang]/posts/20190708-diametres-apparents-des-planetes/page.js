import {genPostPage,PostPageMetadata} from '@/components/post'
import Content, {matter} from './content.mdx'

const postdata = {
	matter,
	Content,

	src: import.meta.url,
}

export const generateMetadata = PostPageMetadata(postdata)
const Page = genPostPage(postdata)
export default Page
