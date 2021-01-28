import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const reMD = /\.md$/

export function getPostSlugs(postsDirectory) {
  const res = fs.readdirSync(postsDirectory).filter(e=>reMD.test(e))
  return res
}

export function getPostBySlug(postsDirectory, slug, fields = []) {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = path.join(postsDirectory, `${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')

  return getPost(realSlug, fileContents, fields)
}

export function getPost(slug, fileContents, fields = []) {
  const realSlug = slug.replace(/\.md$/, '')
  const { data, content } = matter(fileContents)

  const items = {}

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === 'slug') {
      items[field] = realSlug
    }

    if (field === 'content') {
      items[field] = content
    }

    if (data[field]) {
      items[field] = data[field]
    }
  })

  return items
}

export function getAllPosts(folder, fields = []) {
  const postsDirectory = path.join(process.env.ROOT,'pages',folder)
  const slugs = getPostSlugs(postsDirectory)
  const posts = slugs
    .map((slug) => getPostBySlug(postsDirectory, slug, fields))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? '-1' : '1'))
  return posts
}

export function getPostThread(folder,thread,fields=[]) {
  const postsDirectory = path.join(process.env.ROOT,'pages',folder)
  const slugs = getPostSlugs(postsDirectory)
  const posts = slugs
    .map((slug) => getPostBySlug(postsDirectory, slug, [...fields,'thread']))
    .filter(a => a.thread===thread)
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date < post2.date ? '-1' : '1'))
  return posts
}

export function mergeFrontmatter(locale,variation,reference) {
  const mdRef = matter(reference)
  const mdVar = matter(variation)

  const data = {
    ...mdRef.data,
    ...mdVar.data,
    locale
  }

  return matter.stringify(mdVar.content, data)  
}
