const { getOptions } = require('loader-utils');


function loader(source) {

const reSlug = /.*\/(.*)\..*/
const match = this.resourcePath.match(reSlug)
const slug = match? match[1] : 'post'

return `
import {PostPage} from '~/components/post'

const content = \`${source}\`
const slug = '${slug}'

export default props => <PostPage md={content} slug={slug}/>
`;
}


module.exports = loader
