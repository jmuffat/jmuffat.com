import { getDictionary } from './dictionnaries'
import { LocalizedMessagesProvider, LocaleSelector } from './i18n'
import {Header} from './header'
import {Footer} from './footer'

export async function generateStaticParams() {
	return [
		{ lang: 'en' }, 
		{ lang: 'fr' }
	]
}

export async function generateMetadata({ params }) {
	const { lang } = await params
	const isEn = lang === 'en'

	function getBaseUrl() {
		if (	!process.env.NEXT_PUBLIC_URL 
			||	 process.env.NEXT_PUBLIC_URL==='https://') 
		{ 
			return 'http://localhost:3000' 
		}
		else {
			return process.env.NEXT_PUBLIC_URL 
		}			
	}

	return {
		metadataBase: new URL(getBaseUrl()),
		title: 'jmuffat.com',
		description: isEn ?
			'random ideas, by Jérôme Muffat-Méridol'
			: 'idées en vrac, par Jérôme Muffat-Méridol',
	}
}

export default async function LocalizedLayout({ params, children }) {
	const { lang } = await params
	const messages = await getDictionary(lang)

	return (
		<LocalizedMessagesProvider locale={lang} defaultLocale={'en'} messages={messages}>
		
			<div className="flex flex-col" lang={lang}>
				<Header/>
				<main>
					<LocaleSelector locale={lang}/>
					{children}
				</main>
				<Footer/>
				<div className='h-32'/>
			</div>

		</LocalizedMessagesProvider>
	)
}
