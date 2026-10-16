"use client"
import React from 'react'
import { ThemeProvider } from "next-themes"

function Providers({ children }) {
	const scriptProps = typeof window === "undefined" ? undefined : {type: "application/json"};

	return (
		<ThemeProvider 
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
			scriptProps={scriptProps}
		>
			{children}
		</ThemeProvider>
	)
}

export default Providers
