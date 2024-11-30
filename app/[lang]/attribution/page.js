import {genPostPage} from '@/components/post'
import ContentFR, {matter as matterFR} from './content.fr.mdx'
import ContentEN, {matter as matterEN} from './content.fr.mdx'

const postdata = {
	matterEN, matterFR,
	ContentEN, ContentFR,

	src: import.meta.url,
}

const Page = genPostPage(postdata)
export default Page
