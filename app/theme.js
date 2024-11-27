"use client"
import React from 'react'
import { ThemeProvider } from "next-themes"

function Providers({ children }) {
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(
		() => { 
			setMounted(true) 
		},
		[]
	)

	if (!mounted) return null

	return (
		<ThemeProvider 
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
		>
			{children}
		</ThemeProvider>
	)
}

export default Providers
