const fs = require('fs')
const path = require('path')
const { getOptions } = require('loader-utils');
const matter = require('gray-matter')
const ImageSize = require('image-size')

const i18nConfig = require('../i18n-config')

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

function importSupportScript(md) {
  if (md.data.script) {
    return `import MDScript from '${md.data.script}'`
  }
  else {
    return `const MDScript = {}`
  }
}

function loader(source) {

const basePath = path.join(__dirname,'..')
const relPath = path.relative(basePath,this.resourcePath)

const md = matter(source)
const srcLocale = md.data.locale || i18nConfig.nextjsConfig.defaultLocale

const versions = i18nConfig.locales.reduce(
  (cur,locale)=>{
    const translation = path.join(basePath,'i18n',locale, relPath)
    if (fs.existsSync(translation)) {
      const src = fs.readFileSync(translation, {encoding:'utf-8'})
      const mdLocale = matter(src)
      const data = {
        ...md.data,
        ...mdLocale.data,
        locale
      }
      const txt = matter.stringify(mdLocale.content, data)

      cur[locale] = txt.replace(/`/g,'\\`')
    }

    return cur
  },
  {}
)

// if there is the source locale both in pages and i18n, the one in pages wins
versions[srcLocale] = source.replace(/`/g,'\\`')

const reSlug = /.*\/(.*)\..*/
const match = this.resourcePath.match(reSlug)
const slug = match? match[1] : 'post'
const threadPosts = md.data.thread? `getPostThread(folder,'${md.data.thread}',['slug', 'title', 'date'])`: 'null'

const res = `
import PostPage from '~/components/post'
import {getPostThread} from '~/lib/compile-posts'
${importSupportScript(md)}

const slug = '${slug}'

const Page = props => <PostPage md={props.content} slug={slug} script={MDScript} ${coverSize(md)}{...props}/>

export async function getStaticProps( {params,locale} ) {
  const folder = 'posts'
  const threadPosts = ${threadPosts}
  const versions = ${JSON.stringify(versions)}

  return {
    props: {
      threadPosts,
      content: versions[locale]||versions['${srcLocale}']
    },
  }
}


export default Page
`;

return res;
}


module.exports = loader
