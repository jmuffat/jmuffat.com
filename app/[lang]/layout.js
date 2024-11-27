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

	return {
		metadataBase: new URL('https://jmuffat.com'),
		alternates: {
			languages: {
				'en-GB': '/en',
				'fr-FR': '/fr',
			},
		},

		title: 'jmuffat.com',
		description: isEn ?
			'random ideas, by Jérôme Muffat-Méridol'
			: 'idées en vrac, par Jérôme Muffat-Méridol',
		openGraph: {
			siteName: "jmuffat.com",
		}
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
