"use client"
import Image from 'next/image'
import Link from '@/components/link'
import { MailIcon } from 'lucide-react';
import {FormattedDate} from 'react-intl'

import FacebookIcon from "./icons/facebook"
import GithubIcon from "./icons/github"
import LinkedinIcon from "./icons/linkedin"
import RedditIcon from "./icons/reddit"

function SocialButton({href,icon,fill="none"}) {
	if (!href) return null
	const Icon=icon
	return <Link href={href} target="_blank"><Icon fill={fill} /></Link>
}

export function Author({className, author,date}) {
	if (!author) return null;

	return (
		<div className={className}>
			<Image src={author.img} unoptimized alt="portrait" width="128" height="128" />
			<div>
				<div className="mt-4">{author.name}</div>
				<div className="flex flex-row gap-2 w-fit text-black my-1 dark:p-1 dark:bg-neutral-300 dark:rounded">
					<SocialButton href={author.email&&`mailto:${author.email}`} icon={MailIcon} />
					<SocialButton href={author.github} icon={GithubIcon} fill="#000000" />
					<SocialButton href={author.facebook} icon={FacebookIcon} fill="#1877f2" />
					<SocialButton href={author.linkedin} icon={LinkedinIcon} fill="#2867B2" />
					<SocialButton href={author.reddit} icon={RedditIcon} fill="#FF5700" />
				</div>
				<div className="text-xs font-thin text-secondary-foreground" >
					<FormattedDate value={date} year="numeric" month= "long" day="numeric"/>
				</div>
			</div>
		</div>
	);
}
