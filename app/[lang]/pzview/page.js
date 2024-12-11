import {genPostPage} from '@/components/post'
import Content, {matter} from './content.mdx'
import cover from './cover.png'

const postdata = {
	matter,
	Content,
	cover,

	subpostsTitle: {
		en: "News",
		fr: "Actu"
	},
	src: import.meta.url,
}

const Page = genPostPage(postdata)
export default Page
