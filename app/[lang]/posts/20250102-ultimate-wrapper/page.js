import {genPostPage,PostPageMetadata} from '@/components/post'
import Content, {matter} from './content.en.mdx'
// import ContentEN, {matter as matterEN} from './content.en.mdx'
// import ContentFR, {matter as matterFR} from './content.fr.mdx'
import cover from './unique_ptr.jpg'

const postdata = {
	matter, //matterEN, matterFR,
	Content, //ContentEN, ContentFR,
	cover,

	src: import.meta.url,
}

export const generateMetadata = PostPageMetadata(postdata)
const Page = genPostPage(postdata)
export default Page
