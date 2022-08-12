import { CssBaseline, ThemeProvider } from '@mui/material'
import type { AppProps } from 'next/app'
import '../css/fonts.css'
import '../css/global.css'
import { createCustomTheme } from '../shared'

function MyApp({ Component, pageProps }: AppProps) {
	const theme = createCustomTheme('light')
	return (
		<ThemeProvider theme={theme}>
			{/* <CssBaseline /> */}
			<Component {...pageProps} />
		</ThemeProvider>
	)
}

export default MyApp
