import path from 'path'
import fsp from 'fs/promises'
import matter from 'gray-matter'
import Post from '@/components/post'
import { Markdown } from '@/components/markdown2';

const POSTS_FOLDER = path.join(process.cwd(), "posts");

function HistoricMetadata({metadata}) {
	const {historicMetadata} = metadata
	if (!historicMetadata) return null;

	return (
		<>
			<h3>Metadata</h3>
			<code>
				<ul>
					{Object.keys(historicMetadata).map((item, idx) => (
						<li key={idx}>{item} : {metadata[item]}</li>
					))}
				</ul>
			</code>
		</>
	)
}

async function PostPage({ params }) {
    const { slug } = await params
    const filepath = path.join(POSTS_FOLDER, `${slug}.md`)
    const markdown = await fsp.readFile(filepath, { encoding: "utf8" })
    const {data,content} = matter(markdown)

    return (
        <Post metadata={data}>
            <Markdown md={content}/>
            <HistoricMetadata metadata={data} />
        </Post>
    )
}

export default PostPage