import path from 'path'
import fsp from 'fs/promises'
import matter from 'gray-matter'

async function updateCovers(folder, entries) {
    const reCover = /^cover(?:\..*)?.(jpg|png|webp)$/i
    const covers = (
        entries
        .filter(e=>e.isFile() && reCover.test(e.name))
        .map(e=>e.name)
        .sort()
    )

    if (!covers.length) return

    const src = path.join(folder,covers[0])
    const re = reCover.exec(covers[0])
    const ext = re[1]
    await fsp.copyFile(src, path.join(folder,`opengraph-image.${ext}`))
    await fsp.copyFile(src, path.join(folder,`twitter-image.${ext}`))
}

async function parseFolder(
    index,
    folder,
    sitepath
)
{
    const rePage = /^page\.(js|jsx|md|mdx|ts|tsx)$/
    const reContent = /^content(?:\.(.*))?.mdx$/
    const entries = await fsp.readdir(folder,{withFileTypes:true})

    // parse folder
    const page = {}
    for(const e of entries) {
        const currentPath = ()=> path.join(folder, e.name)

        if (!e.isFile()) continue

        if (rePage.test(e.name)) {
            page.src = currentPath()
            page.sitepath = sitepath
            continue
        }

        const content = reContent.exec(e.name)
        if (content) {
            const locale = content[1] ?? '0'
            const fileContents = await fsp.readFile(currentPath(),{encoding:'utf8'})
            const {data} = matter(fileContents)

            page[locale] = data
            continue
        }
    }

    if (page.src) {
        await updateCovers(folder, entries)
        index.push(page)
    }

    // recurse
    for(const e of entries) {
        if (!e.isDirectory()) continue

        const subfolder = path.join(folder, e.name)
        const subpath   = `${sitepath}/${e.name}`
        await parseFolder(index, subfolder,subpath)
    }
}

async function run() {
    const appRoot = path.join(process.cwd(), 'app', '[lang]')
    const index = []

    await parseFolder(index,appRoot,'')

    const destPath = path.join(process.cwd(), 'content-idx', 'index.json')
    const data = JSON.stringify(index, null, 2)
    await fsp.writeFile(destPath, data, {encoding:'utf8'})
}

run()