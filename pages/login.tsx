import React, { useState, useCallback, useEffect } from 'react'
import Image from 'next/image'
import logo from '../public/img/title.png'
import sabzi from '../public/img/bg.png'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Stack from '@mui/material/Stack'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import InputAdornment from '@mui/material/InputAdornment'
import AccountCircle from '@mui/icons-material/AccountCircle'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled } from '@mui/material'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertProps } from '@mui/material/Alert'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
	props,
	ref
) {
	return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

import Router from 'next/router'
const StyledButton = styled(Box)({
	'.hello': {
		width: '50vw',
		height: '60vh',
	},
})

const Login = () => {
	const [success_open, setSucOpen] = React.useState(false)
	const [error_open, setErrOpen] = React.useState(false)

	// const handleClick = () => {
	// 	setOpen(true)
	// }

	const handleSucClose = (
		event?: React.SyntheticEvent | Event,
		reason?: string
	) => {
		if (reason === 'clickaway') {
			return
		}
		setSucOpen(false)
	}
	const handleErrClose = (
		event?: React.SyntheticEvent | Event,
		reason?: string
	) => {
		if (reason === 'clickaway') {
			return
		}
		setErrOpen(false)
	}

	interface State {
		userId: string
		password: string
		showPassword: boolean
	}

	const [values, setValues] = useState<State>({
		userId: '',
		password: '',
		showPassword: false,
	})

	const handleChange =
		(prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
			setValues({ ...values, [prop]: event.target.value })
		}
	const handleChangeUser =
		(prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
			setValues({ ...values, [prop]: event.target.value })
		}

	const handleClickShowPassword = () => {
		setValues({
			...values,
			showPassword: !values.showPassword,
		})
	}

	const handleMouseDownPassword = (
		event: React.MouseEvent<HTMLButtonElement>
	) => {
		event.preventDefault()
	}

	const loginUser = async () => {
		const response = await fetch(
			'http://yd-dev-elb-841236067.ap-south-1.elb.amazonaws.com/api/sm-login',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: values.userId,
					password: values.password,
				}),
			}
		).then((res) => res.json())
		console.log(response)
		if (response.statusCode === 401) {
			setErrOpen(true)
		}
		localStorage.setItem('Token', response.Authorization)
		const TokenCheck = localStorage.getItem('Token')
		if (TokenCheck != 'undefined') {
			setSucOpen(true)
			Router.push('/dashboard')
		}
	}

	useEffect(() => {
		const tokenCheck = localStorage.getItem('Token')
		console.log('token:', tokenCheck)
		if (tokenCheck != 'undefined' && tokenCheck != null) {
			Router.push('/dashboard')
		}
	}, [])

	return (
		<Box
			sx={{
				background:
					'transparent linear-gradient(180deg, #FFECD7 0%, #FFC9C9 100%) 0% 0% no-repeat padding-box',
				width: '100%',
				height: '100vh',
			}}>
			<StyledButton>
				<Box
					sx={{
						width: '30vw',
						height: '12vh',
						marginLeft: '10vh',
						// img: {},
					}}>
					<Image src={logo} alt='logo' />
				</Box>
			</StyledButton>

			<Grid spacing={8}>
				<Grid item xs={1}>
					<Box
						sx={{
							width: '50vw',
							height: '60vh',
							marginLeft: '15vh',
							marginTop: '2vh',
						}}>
						<Image src={sabzi} alt='background' />
					</Box>
				</Grid>
				<Grid item xs={1}>
					<Paper
						sx={{
							position: 'absolute',
							width: '25vw',
							height: '60vh',
							marginTop: '10vh',
							marginLeft: '10vw',
						}}
						elevation={6}>
						<Stack
							spacing={1}
							sx={{
								padding: '2vw',
							}}>
							<Typography variant='h3'>LOGIN</Typography>
							<Typography variant='caption' mb={2} color='secondary'>
								Please login to your account.
							</Typography>
							<FormControl
								required
								color='secondary'
								focused
								variant='outlined'>
								<InputLabel
									sx={{ marginTop: '1vw' }}
									htmlFor='outlined-adornment-password'>
									User ID
								</InputLabel>
								<OutlinedInput
									sx={{ marginTop: '1vw', height: '8vh' }}
									// sx={{ height: '8vh', width: '20vw', marginLeft: '10vw' }}
									id='outlined-adornment-password'
									// type={values.showPassword ? 'text' : 'password'}
									value={values.userId}
									onChange={handleChangeUser('userId')}
									endAdornment={
										<InputAdornment position='end'>
											<AccountCircle />
											<IconButton></IconButton>
										</InputAdornment>
									}
									label='userId'
									placeholder='enter your user id'
								/>
							</FormControl>

							<FormControl
								sx={{ m: 1, margin: '0' }}
								required
								color='secondary'
								focused
								variant='outlined'>
								<InputLabel
									sx={{ marginTop: '1vw' }}
									htmlFor='outlined-adornment-password'>
									Password
								</InputLabel>
								<OutlinedInput
									sx={{ marginTop: '1vw', marginBottom: '1vw', height: '8vh' }}
									// sx={{ height: '8vh', width: '20vw', marginLeft: '10vw' }}
									id='outlined-adornment-password'
									type={values.showPassword ? 'text' : 'password'}
									value={values.password}
									onChange={handleChange('password')}
									endAdornment={
										<InputAdornment position='end'>
											<IconButton
												aria-label='toggle password visibility'
												onClick={handleClickShowPassword}
												onMouseDown={handleMouseDownPassword}
												edge='end'>
												{values.showPassword ? (
													<VisibilityOff />
												) : (
													<Visibility />
												)}
											</IconButton>
										</InputAdornment>
									}
									label='Password'
									placeholder='enter your password'
								/>
							</FormControl>

							<Button
								onClick={loginUser}
								variant='contained'
								sx={{
									backgroundColor: 'orange',
								}}>
								LOGIN
							</Button>
							<Typography
								sx={{
									paddingLeft: '11vw',
								}}
								variant='subtitle2'
								color='orange'>
								Forgot Password?
							</Typography>
						</Stack>
					</Paper>
				</Grid>
			</Grid>
			<Snackbar
				open={error_open}
				autoHideDuration={6000}
				onClose={handleErrClose}>
				<Alert onClose={handleErrClose} severity='error' sx={{ width: '100%' }}>
					Invalid Credentials!
				</Alert>
			</Snackbar>
			<Snackbar
				open={success_open}
				autoHideDuration={6000}
				onClose={handleSucClose}>
				<Alert
					onClose={handleSucClose}
					severity='success'
					sx={{ width: '100%' }}>
					Login Successful!
				</Alert>
			</Snackbar>
		</Box>
	)
}
export default Login
