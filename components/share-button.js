"use client"
import React from 'react'
import { Share } from 'lucide-react'
import FacebookIcon from "./icons/facebook"
import { Button } from "@/components/ui/button"


function NativeShare(props) {

	const onPress = () => {
		navigator.share({
			title: props.title || 'jmuffat.com',
			text: props.text,
			url: props.url,
		})
	}

	return (
		<Button variant="outline" onClick={onPress}><Share /> share</Button>
	);
}

function ButtonBar(props) {
	const onPress = () => {
		window.location.href = `https://www.facebook.com/sharer/sharer.php?u=${props.url}`;
	}

	return <Button variant="outline" onClick={onPress}><FacebookIcon/> share</Button>
}

export default function ShareButton(props) {
	var [shareMethod, setShareMethod] = React.useState(0)

	React.useEffect(() => {
		setShareMethod(navigator.share? 1 : 2)
	}, [])

	switch (shareMethod) {
		case 0: return null;
		case 1: return <NativeShare {...props} />;
		case 2: return <ButtonBar {...props} />;
	}
}
