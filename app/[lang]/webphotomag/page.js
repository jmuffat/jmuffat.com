import {genPostPage,PostPageMetadata} from '@/components/post'
import Content, {matter} from './content.mdx'
import cover from './opengraph-image.jpg'

const postdata = {
	matter,
	Content,
	cover,

	subpostsTitle: {
		en: "Issues",
		fr: "Les numéros"
	},
	src: import.meta.url,
}

export const generateMetadata = PostPageMetadata(postdata)
const Page = genPostPage(postdata)
export default Page
