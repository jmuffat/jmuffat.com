import Post from '@/components/post'
import Content, {matter} from './content.mdx'
import cover from './cover.jpg'

async function Page({params}) {
	const {lang} = await params
	return (
		<Post 
			locales={["fr"]} 
			cover={cover} 
			metadata={matter}
		>
			<Content/>
		</Post>
	)
}

export default Page
