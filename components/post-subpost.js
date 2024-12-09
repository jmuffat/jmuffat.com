'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

export function Subpost({seg}) {
    const pathname = usePathname()
    const href = `${pathname}/${seg}`
	return <Link href={href}>{seg}</Link>
}

