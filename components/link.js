"use client"
import NextLink from 'next/link'
import {useIntl} from 'react-intl'
import {cn} from '@/lib/utils'

export function Link({href,className,hasLocale=false,children,...props}) {
    const intl = useIntl()

    if (href[0]==='/' && !hasLocale) href=`/${intl.locale}${href}`

    return (
        <NextLink className={cn("link", className)} href={href} {...props} legacyBehavior>
            {children}
        </NextLink>
    );
}

export default Link