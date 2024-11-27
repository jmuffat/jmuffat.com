const path = require('path')
const ImageSize = require('image-size')
const matter = require('gray-matter')

const {getAllPosts} = require('@/lib/compile-posts')

function coverSize(md) {
  const cover = md.data.coverImage
  if (!cover) return

  const cwd = process.cwd()
  const coverPath = path.join(cwd,'public',cover)

  const size = ImageSize(coverPath)
  return {
    w: size.width,
    h: size.height
  }
}

function getStaticPropsForPost(folder, md) {
  const posts = getAllPosts(folder,['slug', 'title', 'date','thread'])
  const parsedMD = matter(md)

  return {
    folder,
    posts,
    coverSize: coverSize(parsedMD)
  }
}

module.exports = {
  coverSize,
  getStaticPropsForPost
}
