const { getOptions } = require('loader-utils');


function loader(source) {

const reSlug = /.*\/(.*)\..*/
const match = this.resourcePath.match(reSlug)
const slug = match? match[1] : 'post'

const escapedSource = source.replace(/`/g,'\\`')

return `
import {PostPage} from '~/components/post'

const content = \`${escapedSource}\`
const slug = '${slug}'

const Page = props => <PostPage md={content} slug={slug}/>

export default Page
`;
}


module.exports = loader
