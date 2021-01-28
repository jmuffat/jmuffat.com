const fs = require('fs')
const path = require('path')
const { getOptions } = require('loader-utils');
const matter = require('gray-matter')
const ImageSize = require('image-size')

const i18nConfig = require('../i18n-config')

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

      cur[locale] = matter.stringify(mdLocale.content, data)
    }

    return cur
  },
  {}
)

// if there is the source locale both in pages and i18n, the one in pages wins
versions[srcLocale] = source

const locales = Object.keys(versions).reduce((cur,a)=>cur.length?`${cur},"${a}"`:`"${a}"`, "")
const reSlug = /.*\/(.*)\..*/
const match = this.resourcePath.match(reSlug)
const slug = match? match[1] : 'post'

const res = `
import PostPage from '~/components/post'
import {getPostThread} from '~/lib/compile-posts'
${importSupportScript(md)}

const Page = (props)=> (
  <PostPage
    slug="${slug}"
    content={props.content}
    script={MDScript}
    locales={[${locales}]}
    threadPosts={props.threadPosts}
    ${coverSize(md)}
  />
)

export async function getStaticProps(context) {
  const versions = ${JSON.stringify(versions)}

  return {
    props: {
      content: versions[context.locale]||versions['${srcLocale}'],
      threadPosts: getPostThread('posts','${md.data.thread}',['slug', 'title', 'date'])
    },
  }
}

export default Page
`;

return res;
}


module.exports = loader
