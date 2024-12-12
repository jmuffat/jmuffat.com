"use client"
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {IntlProvider, useIntl} from 'react-intl'
import {cn} from '@/lib/utils'

import FlagFR from './fr.svg'
import FlagEN from './en.svg'

export const LocalizedMessagesProvider = (props)=> <IntlProvider {...props}/>

export function LocaleSelector({available = ['en','fr']}) {
	const intl = useIntl()
	const pathname = usePathname()
	const locales = [
		{id:'en', img: FlagEN},
		{id:'fr', img: FlagFR}
	]
	
	const re = /^\/[^\/]*(\/.*)/.exec(pathname)
	const basePath = re? re[1] : "/"
  
	return (
		<ul className="max-w-5xl mx-auto px-4 py-1 gap-2 flex flex-row justify-end place-items-center">
			{locales.map(loc => {
				const className = cn({
					'h-4 w-6 border relative': true,
					'border-red-400 bg-red-400': loc.id === intl.locale,
					'border-transparent': loc.id !== intl.locale,
					'blur-[1px] opacity-50': !available.includes(loc.id)
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
