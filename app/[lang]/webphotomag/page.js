import Post from '@/components/post'
import Content, {matter} from './content.mdx'
import coverFR from './cover.fr.jpg'
import coverEN from './cover.en.jpg'

async function Page({params}) {
	const {lang} = await params
	return (
		<Post 
			locales={["fr"]} 
			cover={lang==='fr'? coverFR : coverEN} 
			metadata={matter}
		>
			<Content/>
		</Post>
	)
}

export default Page
