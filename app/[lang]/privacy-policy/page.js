import {genPostPage} from '@/components/post'
import ContentEN, {matter as matterEN} from './content.en.mdx'
import ContentFR, {matter as matterFR} from './content.fr.mdx'


const postdata = {
	matterEN, matterFR,
	ContentEN, ContentFR,

	src: import.meta.url,
}

const Page = genPostPage(postdata)
export default Page
