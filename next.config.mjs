import path from 'path'
// const WorkerPlugin = require('worker-plugin');

import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import rehypeExternalLinks from 'rehype-external-links'

// import i18nConfig from './i18n-config.mjs'

async function redirects() {
	// old blog used this format : /2020/03/04/my-first-paid-job
	return [
		{
			source: '/:yy(\\d{1,})/:mm(\\d{1,})/:dd(\\d{1,})/:slug',
			destination: '/posts/:yy:mm:dd-:slug',
			permanent: true
		}
	]
}

const nextConfig = {
	pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
	// i18n: i18nConfig.nextjsConfig,
	redirects,

	sassOptions: {
		silenceDeprecations: ['legacy-js-api'],
	},

	env: {
		ROOT: path.resolve(process.cwd())
	},
}

const withMDX = createMDX({
	options: {
		remarkPlugins: [
			remarkGfm
		],
		rehypePlugins: [
			[rehypeExternalLinks, { target: '_blank' }],
		],
	}
})

export default withMDX(nextConfig)