"use client"
import Link from '@/components/link'
import {FormattedMessage} from 'react-intl'

export const Footer = ()=>(
	<footer>
		<div className="max-w-5xl p-4 mx-auto bg-secondary text-muted-foreground rounded-b-xl">
			<small><Link href="/privacy-policy"><FormattedMessage id="3zXjyR" description="in footer" defaultMessage="Privacy Policy" /></Link></small><br />
			<small><Link href="/attribution"><FormattedMessage id="VRa0Qo" description="in footer" defaultMessage="Attribution" /></Link></small><br />
			<small><FormattedMessage
				id="x4hSe8"
				description="in footer"
				defaultMessage="site authored by {jmm} and hosted by {vercel}"
				values={{
					jmm: <Link key="jmm" href="mailto:jmuffat@webphotomag.com" target="_blank">Jérôme Muffat-Méridol</Link>,
					vercel: <Link key="vercel" href="https://vercel.com/" target="_blank">vercel.com</Link>
				}}
			/></small><br />
		</div>
	</footer>
)
