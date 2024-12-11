import Link from '@/components/link'
import {PostPage,PostBody} from '@/components/post'
import {ThreadDate} from './page-client'

import contentIndex from '@/content-idx/index.json'
import threadsInfo from '@/content-idx/threads.json'

function postMeta(a,lang) {
    // const reSlug = /\/posts\/(.*)/.exec(a.sitepath)
    // if (!reSlug) return null
    // const slug = reSlug[1]

    const val = (r,key) => r? r[key] : null
    const merge = key => val(a.en,key) ?? val(a.fr,key) ?? val(a[0],key)

    return {
        sitepath: a.sitepath,
        date: merge("date"),
        thread: merge("thread"), 
        ...(a[lang]??a[0]),
    }
}

function Thread({id,posts}) {
    const title = id? threadsInfo[id].title??id : "Uncategorised"
    const threadPosts = (
        posts
        .filter(id? a=>a.thread===id : a=>!a.thread)
        .sort( (a,b)=> (b.date??"").localeCompare(a.date??""))
    )

    return (
        <div>
            <h1>{title}</h1>
            <ul>
            {threadPosts.map( a => (
                <li key={a.sitepath}>
                    <ThreadDate>{a.date}</ThreadDate> <Link href={a.sitepath}>{a.title}</Link>
                </li>
            ))}
            </ul>
        </div>
    )
}

export default async function PostsListPage({params}) {
    const {lang} = await params

    const posts = (
        contentIndex
        .filter( a => a.sitepath.startsWith('/posts/'))
        .map( a=>postMeta(a,lang))
    )

    const threadDates = (
        posts
        .reduce( 
            (cur,a)=> {
                if (a.thread) {
                    if (!cur[a.thread] || cur[a.thread]<a.date)
                        cur[a.thread] = a.date
                }
                return cur
            },
            {}
        )
    )

    const threads = (
        Object.keys(threadDates)
        .sort((a,b)=> threadDates[b].localeCompare(threadDates[a]))
    )

    return (
        <PostPage>
            <PostBody className="markdown text-sm">
                {threads.map( id => <Thread key={id} id={id} posts={posts}/>)}
                <Thread id={null} posts={posts}/>
            </PostBody>
        </PostPage>
    )
}
