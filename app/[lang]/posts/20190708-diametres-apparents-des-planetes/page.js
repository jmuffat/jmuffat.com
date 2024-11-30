import {genPostPage} from '@/components/post'
import Content, {matter} from './content.mdx'

const postdata = {
	matter,
	Content,

	src: import.meta.url,
}

const Page = genPostPage(postdata)
export default Page
