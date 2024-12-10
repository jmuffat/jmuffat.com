import '@/styles/tw-globals.css'
import '@/components/youtube/youtube.scss'
import ThemeProvider from './theme'

export default function RootLayout({ children }) {
	return (
		<html>
			<body>
				<ThemeProvider>
				{children}
				</ThemeProvider>
			</body>
		</html>
	)
}
