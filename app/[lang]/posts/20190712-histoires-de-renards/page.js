import {genPostPage,PostPageMetadata} from '@/components/post'
import Content, {matter} from './content.mdx'
import cover from './opengraph-image.png'

const postdata = {
	matter,
	Content,
	cover,

	src: import.meta.url,
}

const Page = genPostPage(postdata)
export default Page
