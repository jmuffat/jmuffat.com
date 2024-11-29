import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { NextResponse } from "next/server";

const locales = ['en', 'fr']
const defaultLocale = locales[0]

const localeReady = new Set([
	...locales,
	'download',
	'img'
])

// Get the preferred locale, similar to the above or using a library
function getLocale(request) {
	const h = 'accept-language'
	const headers = { [h]: request.headers.get(h) }
	const nego = new Negotiator({ headers })
	const languages = nego.languages()
	return match(languages, locales, defaultLocale)
}

export function middleware(request) {
	// Check if there is any supported locale in the pathname
	const { pathname } = request.nextUrl

	const re = /^\/([^\/?#]*)/.exec(pathname)
	if (!re) return

	const restOfPath = pathname.substring(re[1].length+1)

	if (localeReady.has(re[1])) return

	// We need to redirect
	switch (re[1].toLowerCase()) {
		/* cases where we want to rename the locale, so old url's still work */ 
		case 'fr-fr': {
			request.nextUrl.pathname = `/fr${restOfPath}`
		}	break

		case 'en-us':
		case 'en-gb': {
			request.nextUrl.pathname = `/en${restOfPath}`
		}	break

		/* cases where the locale wasn't specified and we need to _add_ it */ 
		default: {
			const locale = getLocale(request)
			request.nextUrl.pathname = `/${locale}${pathname}`
		}
	}

	return NextResponse.redirect(request.nextUrl)
}

export const config = {
	matcher: [
		'/((?!_next).*)',
		'/'
	],
}