import {genPostPage,PostPageMetadata} from '@/components/post'
import ContentEN, {matterEN} from './content.en.mdx'
import ContentFR, {matterFR} from './content.fr.mdx'
import cover from './opengraph-image.jpg'

const postdata = {
	matterEN, matterFR,
	ContentEN, ContentFR,
	cover,

	src: import.meta.url,
}

export const generateMetadata = PostPageMetadata(postdata)
const Page = genPostPage(postdata)
export default Page
