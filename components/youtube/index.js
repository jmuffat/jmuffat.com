export const cnYoutubeAccept = accept => accept? "accept-youtube" : "without-accept-youtube"

export function Youtube({ id }) {
	const embedURL = `https://www.youtube-nocookie.com/embed/${id}?rel=0`;
	// const pageURL  = `https://www.youtube.com/watch?v=${id}`;
	// const imageURL = `https://img.youtube.com/vi/${id}/0.jpg`

	return (
		<div className="youtube-responsive youtube-responsive-16by9">
			<iframe
				className="youtube-responsive-item"
				type="text/html"
				width={640}
				height={390}
				src={embedURL}
				frameBorder="0"
				allowFullScreen>
			</iframe>
		</div>
	)
}
