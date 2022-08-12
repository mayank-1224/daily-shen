import { createContext } from 'react'
import * as React from 'react'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert'
interface snackbarContextInterface {
	customizedSnackbar: (message: string, severity: AlertColor) => void
}
const snackbarContext = createContext<snackbarContextInterface>(
	{} as snackbarContextInterface
)
export function Snackbarr({ children }: { children: any }) {
	const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
		props,
		ref
	) {
		return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
	})
	const [snackbarProps, setSnackbarProps] = React.useState<{
		open: boolean
		message: string
		severity: AlertColor
	}>({
		open: false,
		message: '',
		severity: 'success',
	})
	const customizedSnackbar = React.useCallback(
		(message: string, severity: AlertColor) => {
			setSnackbarProps({ open: true, message, severity })
		},
		[]
	)
	const handleClose = React.useCallback(
		(event: React.SyntheticEvent | Event, reason?: string) => {
			if (reason === 'clickaway') {
				setSnackbarProps({ ...snackbarProps, open: false })
				return
			}
			setSnackbarProps({ ...snackbarProps, open: false })
		},
		[snackbarProps]
	)
	const providerValue = React.useMemo(
		() => ({
			customizedSnackbar,
		}),
		[customizedSnackbar]
	)
	return (
		<snackbarContext.Provider value={providerValue}>
			{children}
			<Snackbar
				open={snackbarProps.open}
				autoHideDuration={6000}
				onClose={handleClose}>
				<Alert severity={snackbarProps.severity} sx={{ width: '100%' }}>
					{snackbarProps.message}
				</Alert>
			</Snackbar>
		</snackbarContext.Provider>
	)
}
export default snackbarContext
