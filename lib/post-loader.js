const { getOptions } = require('loader-utils');
const matter = require('gray-matter')


function makeGetStaticProps(source) {
  const { data, content } = matter(source)
  const thread = data.thread

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

function loader(source) {

const reSlug = /.*\/(.*)\..*/
const match = this.resourcePath.match(reSlug)
const slug = match? match[1] : 'post'

const escapedSource = source.replace(/`/g,'\\`')

const res = `
import {PostPage} from '~/components/post'
import {getPostThread} from '~/lib/compile-posts'

const content = \`${escapedSource}\`
const slug = '${slug}'

const Page = props => <PostPage md={content} slug={slug} {...props}/>

${makeGetStaticProps(source)}

export default Page
`;

return res;
}


module.exports = loader
