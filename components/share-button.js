"use client"
import React from 'react'
import { Share } from 'lucide-react'
import FacebookIcon from "./icons/facebook"
import { Button } from "@/components/ui/button"


function NativeShare({className, title='jmuffat.com', text, url}) {

	const onPress = () => navigator.share({title,text,url})

	return (
		<Button className={className} variant="outline" onClick={onPress}><Share /> share</Button>
	);
}

function ButtonBar({className,url}) {
	const onPress = () => {
		window.location.href = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
	}

	return <Button className={className} variant="outline" onClick={onPress}><FacebookIcon/> share</Button>
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
