import {genPostPage,PostPageMetadata} from '@/components/post'
import Content, {matter} from './content.mdx'
import coverFR from './cover.fr.jpg'
import coverEN from './cover.en.jpg'

const postdata = {
	matter,
	Content,
	coverFR,
	coverEN,

	subpostsTitle: {
		en: "Issues",
		fr: "Les numéros"
	},
	src: import.meta.url,
}

export const generateMetadata = PostPageMetadata(postdata)
const Page = genPostPage(postdata)
export default Page
