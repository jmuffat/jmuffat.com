const path = require('path')
const ImageSize = require('image-size')

export function coverSize(md) {
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
