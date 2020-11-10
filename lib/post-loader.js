const path = require('path')
const { getOptions } = require('loader-utils');
const matter = require('gray-matter')
const ImageSize = require('image-size')

function makeGetStaticProps(md) {
  const thread = md.data.thread

  if (!thread) return ''

  return (
`export async function getStaticProps( {params} ) {
  const folder = 'posts'
  const threadPosts = getPostThread(folder,'${thread}',['slug', 'title', 'date'])

  return {
    props: {
      threadPosts
    },
  }
}`
  )
}

function coverSize(md) {
  const cover = md.data.coverImage
  if (!cover) return ''

  const coverPath = path.join(__dirname,'..','public',cover)
  const size = ImageSize(coverPath)

  return `coverSize={{w:${size.width},h:${size.height}}} `
}

function loader(source) {

const reSlug = /.*\/(.*)\..*/
const match = this.resourcePath.match(reSlug)
const slug = match? match[1] : 'post'

const escapedSource = source.replace(/`/g,'\\`')

const md = matter(source)

const res = `
import {PostPage} from '~/components/post'
import {getPostThread} from '~/lib/compile-posts'

const content = \`${escapedSource}\`
const slug = '${slug}'

const Page = props => <PostPage md={content} slug={slug} ${coverSize(md)}{...props}/>

${makeGetStaticProps(md)}

export default Page
`;

return res;
}


module.exports = loader
