"use client"
import NextLink from 'next/link'
import {useIntl} from 'react-intl'
import {cn} from '@/components/cn'

export function Link({href,className,children,...props}) {
    const intl = useIntl()

    if (href[0]==='/') href=`/${intl.locale}${href}`

    return (
        <NextLink className={cn("link", className)} href={href} {...props}>
            {children}
        </NextLink>
    )
}

export default Link