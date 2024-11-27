import {NarrowPageBody} from '@/components/narrow-body'

export default async function HomePage({params}) {
    const {lang} = await params
    return (
        <NarrowPageBody> 
            <h1>Home ({lang})</h1>
        </NarrowPageBody>
    )
}