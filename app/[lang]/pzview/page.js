import {genPostPage,PostPageMetadata} from '@/components/post'
import Content, {matter} from './content.mdx'
import cover from './opengraph-image.png'

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

export const generateMetadata = PostPageMetadata(postdata)
const Page = genPostPage(postdata)
export default Page
