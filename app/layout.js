import '@/styles/globals.css'
import '@/components/youtube/youtube.scss'
import '@/styles/vs2015.css'
import ThemeProvider from './theme'

export default function RootLayout({ children }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body>
				<ThemeProvider>
				{children}
				</ThemeProvider>
			</body>
		</html>
	)
}
