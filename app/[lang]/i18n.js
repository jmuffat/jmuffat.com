"use client"
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {IntlProvider} from 'react-intl'
import {cn} from '@/components/cn'

import FlagFR from './fr.svg'
import FlagEN from './en.svg'

export const LocalizedMessagesProvider = (props)=> <IntlProvider {...props}/>

export function LocaleSelector({available = ['en','fr']}) {
	const pathname = usePathname()
	const locales = [
		{id:'en', img: FlagEN},
		{id:'fr', img: FlagFR}
	]
	
	const re = /^\/[^\/]*(\/.*)/.exec(pathname)
	const basePath = re? re[1] : "/"
  
	return (
		<ul className="max-w-5xl mx-auto px-4 py-1 gap-2 flex flex-row justify-end place-items-center border-r border-l border-secondary">
			{locales.map(loc => {
				const className = cn({
					'h-4 w-6 border rounded relative': true,
					'border-red': loc.id === locale,
					'border-transparent': loc.id !== locale,
					'blur-[1px] opacity-50': !available.find(a=>a.id==loc.id)
				})

				return (
					<li key={loc.id} className={className}>
						<Link href={`/${loc.id}${basePath}`}>
							<Image src={loc.img} alt={loc.id} fill/>
						</Link>
					</li>
				)
			})}
		</ul>
	)
}
