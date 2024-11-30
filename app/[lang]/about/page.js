import {genPostPage} from '@/components/post'
import Content, {matter} from './content.mdx'
import cover from '@/public/img/2019-jerlock.jpg'

const postdata = {
	matter,
	Content,
	cover,

	src: import.meta.url,
}

const Page = genPostPage(postdata)
export default Page
