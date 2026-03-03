import path from 'path'

import createMDX from '@next/mdx'

async function redirects() {
	// old blog used this format : /2020/03/04/my-first-paid-job
	return [
		// {
		// 	source: '/:yy(\\d{1,})/:mm(\\d{1,})/:dd(\\d{1,})/:slug',
		// 	destination: '/posts/:yy:mm:dd-:slug',
		// 	permanent: true
		// }
	]
}

const nextConfig = {
	pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
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
			['remark-gfm'],
			['remark-frontmatter'], 
			['remark-mdx-frontmatter', {name: 'matter'}]
		],
		rehypePlugins: [
			['rehype-external-links', {target: '_blank' }],
			['rehype-highlight'],
		],
	}
})

export default withMDX(nextConfig)
