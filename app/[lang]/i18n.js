"use client"
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {IntlProvider} from 'react-intl'
import {cn} from '@/components/cn'


export const LocalizedMessagesProvider = (props)=> <IntlProvider {...props}/>

export function LocaleSelector({locale}) {
	const pathname = usePathname()
	const locales = ['en','fr']
	
	const re = /^\/[^\/]*(\/.*)/.exec(pathname)
	const basePath = re? re[1] : "/"
  
	return (
		<ul className="max-w-5xl mx-auto px-4 py-1 flex flex-row justify-end place-items-center border-r border-l border-secondary">
			{locales.map(loc => {
				const className = cn({
					'pl-1 border rounded': true,
					'border-red': loc === locale,
					'border-transparent': loc !== locale,
					'blur-[1px] opacity-50': !locales.includes(loc)
				})

				return (
					<li key={loc} className={className}>
						<Link href={`/${loc}${basePath}`}>
							<Image src={`/img/${loc}.svg`} alt={loc} width="30" height="20"/>
						</Link>
					</li>
				)
			})}
		</ul>
	)
}
