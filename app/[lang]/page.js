import Image from 'next/image'
import NextLink from 'next/link'
import { cn } from '@/lib/utils'
import Link from '@/components/link'
import {NarrowPageBody} from '@/components/narrow-body'

import cover from '@/data/2019-jerlock.jpg'
import iconCv from '@/data/cv.svg'
import iconMap from '@/data/map.svg'

import { Open_Sans, Merriweather } from 'next/font/google'
const openSans = Open_Sans({ subsets: ['latin'] })
const merriweather = Merriweather({ subsets: ['latin'], weight:"400", style:"italic" })

const Icon = ({href,icon,target,children,})=>(
    <NextLink className="flex flex-col items-center p-2" href={href} target={target}>
        <Image className="bg-white" src={icon} width="48" height="48"/>
        <div className='link text-gray-600 dark:text-gray-400'>{children}</div>
    </NextLink>
) 

export default async function HomePage({params}) {
    const {lang} = await params
    return (
        <NarrowPageBody> 
            <div className="flex flex-col items-center my-16">
                <Link href="/posts">
                    <Image src={cover} alt="portrait" width={256} height={256}/>
                </Link>
                <div {...openSans} className="text-[64px] mt-[-32px] font-thin text-[#989286]">jmuffat</div>    
                <div {...merriweather} className="text-base italic text-gray-600 dark:text-gray-400">what can be done can be done better</div>
            </div>
            
            <div className="flex flex-row gap-4">
                <Icon icon={iconCv} href="/download/cvjmm.pdf" target="_blank">cvjmm.pdf</Icon>
                <Icon icon={iconMap} href="/maps">maps</Icon>
            </div>
        </NarrowPageBody>
    )
}