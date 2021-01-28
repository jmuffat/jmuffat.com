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

const localeVariableName = locale =>`version_${locale.replace('-','')}`

function loader(source) {

const basePath = path.join(__dirname,'..')
const relPath = path.relative(basePath,this.resourcePath)

const md = matter(source)
const srcLocale = md.data.locale || i18nConfig.nextjsConfig.defaultLocale

const versions = i18nConfig.locales.reduce(
  (cur,locale)=>{
    const translation = path.relative(
      basePath,
      path.join(basePath,'i18n',locale, relPath)
    )
    if (fs.existsSync(translation)) cur[locale] = '~/'+translation
    return cur
  },
  {}
)

const imports = (
  Object.keys(versions)
  .map( locale=>`import ${localeVariableName(locale)} from '${versions[locale]}'` )
  .join('\n')
)

const versionSwitch = (
  Object.keys(versions)
  .map( locale => `case '${locale}': return ${localeVariableName(locale)}`)
  .join('\n')
)

// if there is the source locale both in pages and i18n, the one in pages wins
versions[srcLocale] = source

const locales = Object.keys(versions).reduce((cur,a)=>cur.length?`${cur},"${a}"`:`"${a}"`, "")
const reSlug = /.*\/(.*)\..*/
const match = this.resourcePath.match(reSlug)
const slug = match? match[1] : 'post'

const res = `
import PostPage from '~/components/post'
import {getPostThread,mergeFrontmatter} from '~/lib/compile-posts'
${importSupportScript(md)}

${imports}

function getSource(locale){
  switch (locale) {
    ${versionSwitch}
  }
  return null
}

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
  const defaultVersion = ${JSON.stringify(source)}

  const findVersion = locale=>{
    const src = getSource(locale)
    if (src) return mergeFrontmatter(locale,src,defaultVersion)
    return defaultVersion
  }

  return {
    props: {
      content: findVersion(context.locale),
      threadPosts: getPostThread('posts','${md.data.thread}',['slug', 'title', 'date'])
    },
  }
}

export default Page`;

return res;
}


module.exports = loader
