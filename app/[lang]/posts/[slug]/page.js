import path from 'path'
import fsp from 'fs/promises'
import Post from '@/components/post'

const POSTS_FOLDER = path.join(process.cwd(), "posts");

async function PostPage({ params }) {
    const { slug } = await params
    const filepath = path.join(POSTS_FOLDER, `${slug}.md`)
    const markdown = await fsp.readFile(filepath, { encoding: "utf8" })

    return <Post content={markdown}/>
}

export default PostPage