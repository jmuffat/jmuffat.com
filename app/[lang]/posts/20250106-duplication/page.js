import {genPostPage,PostPageMetadata} from '@/components/post'
// import Content, {matter} from './content.en.mdx'
import ContentEN, {matter as matterEN} from './content.en.mdx'
import ContentFR, {matter as matterFR} from './content.fr.mdx'
import cover from './opengraph-image.webp'

const postdata = {
	// matter, Content, 
	matterEN, ContentEN,
	matterFR, ContentFR,
	cover,

	src: import.meta.url,
}

export const generateMetadata = PostPageMetadata(postdata)
const Page = genPostPage(postdata)
export default Page
