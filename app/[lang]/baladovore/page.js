import React from 'react'
import Post from '@/components/post'
import Content, {metadata} from './baladovore.mdx'

function HistoricMetadata({metadata}) {
	const {historicMetadata} = metadata
	if (!historicMetadata) return null;

	return (
		<>
			<h3>Metadata</h3>
			<code>
				<ul>
					{Object.keys(historicMetadata).map((item, idx) => (
						<li key={idx}>{item} : {metadata[item]}</li>
					))}
				</ul>
			</code>
		</>
	)
}

function Page(props) {
	return (
		<Post locales={["fr"]} metadata={metadata}>
			<div className="markdown">
				<Content/>
			</div>
			<HistoricMetadata metadata={metadata} />
		</Post>
	)
}

export default Page;

