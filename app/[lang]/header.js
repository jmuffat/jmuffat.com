"use client"
import React from 'react'
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuIndicator,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	NavigationMenuViewport,
	navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu"

import Link from '@/components/link'
import { FormattedMessage } from 'react-intl'

const NavItem = ({href,children})=>(
	<NavigationMenuItem>
		<Link href={href} legacyBehavior passHref>
			<NavigationMenuLink className={navigationMenuTriggerStyle()}>
				{children}
			</NavigationMenuLink>
		</Link>
	</NavigationMenuItem>
)

export const Header = () => (
	<header className='mainmenu-background'>
		<div className="max-w-5xl w-full mx-auto flex h-14 items-center px-4">
			<div className="text-2xl text-stone-200 font-bold pr-4">
				<Link className="no-underline" href="/">jmuffat</Link>
			</div>
			<div className="flex-grow"/>
			<NavigationMenu>
				<NavigationMenuList>
					<NavItem href="/pzview"> <FormattedMessage id="FYR26p" description="menu: pzView" defaultMessage="pzView"/> </NavItem>
					<NavItem href="/baladovore"> <FormattedMessage id="9UrABp" description="menu: baladovore" defaultMessage="baladovore"/> </NavItem>
					<NavItem href="/webphotomag"> <FormattedMessage id="nLKhFA" description="menu: webphotomag" defaultMessage="webphotomag"/> </NavItem>
					<NavItem href="/posts"> <FormattedMessage id="ehjSQb" description="menu: blog" defaultMessage="blog"/> </NavItem>
					<NavItem href="/about"> <FormattedMessage id="/Em3NB" description="menu: about" defaultMessage="about"/> </NavItem>
				</NavigationMenuList>
			</NavigationMenu>

		</div>
	</header>
)
