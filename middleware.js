import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { NextResponse } from "next/server";

const locales = ['en', 'fr']
const defaultLocale = locales[0]

const localeReady = new Set([
  ...locales,
  'download',
  'img',

  'android-icon-36x36.png',
  'android-icon-48x48.png',
  'android-icon-72x72.png',
  'android-icon-96x96.png',
  'android-icon-144x144.png',
  'android-icon-192x192.png',
  'apple-icon-57x57.png',
  'apple-icon-60x60.png',
  'apple-icon-72x72.png',
  'apple-icon-76x76.png',
  'apple-icon-114x114.png',
  'apple-icon-120x120.png',
  'apple-icon-144x144.png',
  'apple-icon-152x152.png',
  'apple-icon-180x180.png',
  'apple-icon-precomposed.png',
  'apple-icon.png',
  'browserconfig.xml',
  'favicon-16x16.png',
  'favicon-32x32.png',
  'favicon-96x96.png',
  'favicon.ico',
  'manifest.json',
  'ms-icon-70x70.png',
  'ms-icon-144x144.png',
  'ms-icon-150x150.png',
  'ms-icon-310x310.png',
])

// Get the preferred locale, similar to the above or using a library
function getLocale(request) {
    const h = 'accept-language'
    const headers = {[h]: request.headers.get(h)}
    const nego = new Negotiator({headers})
    const languages = nego.languages()
    return match(languages, locales, defaultLocale)
}
 
export function middleware(request) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl
  
  const re = /^\/([^\/?#]*)/.exec(pathname)
  if (!re) return


  if (!localeReady.has(re[1])) {
    // Redirect if there is no locale
    const locale = getLocale(request)
    request.nextUrl.pathname = `/${locale}${pathname}`
    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(request.nextUrl)
  }
}
 
export const config = {
  matcher: [
    '/((?!_next).*)',
    '/'
  ],
}