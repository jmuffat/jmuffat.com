import {genPostPage} from '@/components/post'
import ContentEN, {matter as matterEN} from './content.en.mdx'
import ContentFR, {matter as matterFR} from './content.fr.mdx'
import cover from '@/public/img/2019-jerlock.jpg'

const postdata = {
	matterEN, matterFR,
	ContentEN, ContentFR,
	cover,

	src: import.meta.url,
}

const Page = genPostPage(postdata)
export default Page
