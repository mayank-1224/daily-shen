import * as React from 'react'
import { useState, useEffect, useMemo, useCallback } from 'react'
import LogoutIcon from '@mui/icons-material/Logout'
import Button from '@mui/material/Button'
import Image from 'next/image'
import logo from '../public/img/White_BG.png'
import Router from 'next/router'
import { Typography } from '@mui/material'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'
import Stack from '@mui/material/Stack'
import Checkbox from '@mui/material/Checkbox'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import Avatar from '@mui/material/Avatar'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { createContext } from 'react'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert, { AlertColor, AlertProps } from '@mui/material/Alert'
import { border, Box, fontFamily } from '@mui/system'
import { useSearchParams } from 'react-router-dom'
import { useRef } from 'react'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
	props,
	ref
) {
	return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

const Dashboard = () => {
	const [unfiltered, setUnfiltered] = useState([])
	const [checked, setChecked] = useState([1])
	const [display, setDisplay] = useState([])
	const [update, setUpdate] = useState(false)
	const [addOpen, setAddOpen] = useState(false)
	const [editOpen, setEditOpen] = useState(false)
	const [newName, setNewName] = useState('')
	const [qty, setQty] = useState('')
	const [price, setPrice] = useState('')
	const [inStock, setInStock] = useState(true)
	const [itemCategory, setItemCategory] = useState(1)
	const [editID, setEditID] = useState<any>('')
	const [add, setAdd] = useState(false)
	const [success_open, setSucOpen] = React.useState(false)
	const [clientOpen, setClientOpen] = React.useState(false)
	const [serverOpen, setServerOpen] = React.useState(false)
	const [currTab, setCurrTab] = React.useState([])
	const isMounted = useRef(false)
	//const [searchParams, setSearchParams] = useSearchParams()

	//logout functionality--------->
	const logoutUser = () => {
		console.log('im clicked')
		localStorage.removeItem('Token')
		const TokenCheck = localStorage.getItem('Token')
		if (TokenCheck === null) {
			Router.push('/login')
		}
		//console.log(TokenCheck)
	}
	useEffect(() => {
		const tokenCheck = localStorage.getItem('Token')
		console.log('token:', tokenCheck)
		if (tokenCheck != 'undefined' && tokenCheck != null) {
			Router.push('/dashboard')
		} else {
			Router.push('/login')
		}
	}, [])

	const success_close = (
		event?: React.SyntheticEvent | Event,
		reason?: string
	) => {
		if (reason === 'clickaway') {
			return
		}
		setSucOpen(false)
	}
	const clientClose = (
		event?: React.SyntheticEvent | Event,
		reason?: string
	) => {
		if (reason === 'clickaway') {
			return
		}
		setSucOpen(false)
	}
	const serverClose = (
		event?: React.SyntheticEvent | Event,
		reason?: string
	) => {
		if (reason === 'clickaway') {
			return
		}
		setSucOpen(false)
	}

	//--------------------------------------------
	//calling API for all items info---------------------------->
	const getData = async () => {
		const authToken = localStorage.getItem('Token')
		const res = await fetch(
			'http://yd-dev-elb-841236067.ap-south-1.elb.amazonaws.com/api/store-manager/item',
			{
				method: 'GET',
				headers: {
					Authorization: `${authToken}`,
				},
			}
		).then((response) => response.json())

		if (res.status >= 400 && res.status < 500) {
			setClientOpen(true)
		} else if (res.status >= 500) {
			setServerOpen(true)
		} else {
			setSucOpen(true)
			setUnfiltered(res)
			setDisplay(res)
			//setDisplay(currTab)
		}
	}
	useEffect(() => {
		getData()
	}, [update])

	// const updateData = async () => {
	// 	const authToken = localStorage.getItem('Token')
	// 	const res = await fetch(
	// 		'http://yd-dev-elb-841236067.ap-south-1.elb.amazonaws.com/api/store-manager/item',
	// 		{
	// 			method: 'GET',
	// 			headers: {
	// 				Authorization: `${authToken}`,
	// 			},
	// 		}
	// 	).then((response) => response.json())

	// 	if (res.status >= 400 && res.status < 500) {
	// 		setClientOpen(true)
	// 	} else if (res.status >= 500) {
	// 		setServerOpen(true)
	// 	} else {
	// 		setSucOpen(true)
	// 		setUnfiltered(res)
	// 		setDisplay(currTab)
	// 	}
	// }

	// useEffect(() => {
	// 	if (isMounted.current) {
	// 		updateData()
	// 	} else {
	// 		isMounted.current = true
	// 	}
	// }, [update])

	//-------------------------------------------------------------

	//updating filter based on user selection---------------------->
	const { vegetables, fruits, others, allItems } = useMemo(() => {
		const vegetables: any = [],
			fruits: any = [],
			others: any = [],
			allItems: any = []
		unfiltered.map((item: any) => {
			allItems.push(item)
			switch (item.categoryID) {
				case 1:
					vegetables.push(item)
					break
				case 2:
					fruits.push(item)
					break
				default:
					others.push(item)
					break
			}
		})
		return { vegetables, fruits, others, allItems }
	}, [unfiltered])

	const filterClickHandler = useCallback(
		(e: any) => {
			if (e.target.innerText === 'ALL ITEMS') {
				setCurrTab(allItems)
				setDisplay(allItems)
			} else if (e.target.innerText === 'VEGETABLES') {
				setCurrTab(vegetables)
				setDisplay(vegetables)
			} else if (e.target.innerText === 'FRUITS') {
				setCurrTab(fruits)
				setDisplay(fruits)
			} else {
				setCurrTab(others)
				setDisplay(others)
			}
		},
		[allItems, vegetables, fruits, others]
	)

	const deleteHandler = async (id: any) => {
		const tokenCheck = localStorage.getItem('Token')
		const response = await fetch(
			`http://yd-dev-elb-841236067.ap-south-1.elb.amazonaws.com/api/store-manager/item/${id}`,
			{
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: tokenCheck as string,
				},
			}
		)
		setUpdate(!update)
	}

	const handleAddOpen = () => {
		setAddOpen(true)
	}

	const handleAddCancel = () => {
		setAddOpen(false)
	}

	const handleAddSubmit = async () => {
		setAddOpen(false)
		console.log(newName, qty, price, inStock, itemCategory)
		const tokenCheck = localStorage.getItem('Token')
		const response = await fetch(
			`http://yd-dev-elb-841236067.ap-south-1.elb.amazonaws.com/api/store-manager/item`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: tokenCheck as string,
				},
				body: JSON.stringify({
					name: newName,
					baseQuantity: qty,
					price: Number(price),
					inStock: inStock,
					category: Number(itemCategory),
					imageId: 100,
				}),
			}
		)
		setNewName('')
		setQty('')
		setPrice('')
		setInStock(true)
		setItemCategory(1)
		setUpdate(!update)
	}

	const handleEditOpen = (item: any) => {
		setEditOpen(true)
		setAdd(true)
		setNewName(item.name)
		setQty(item.baseQuantity)
		setPrice(item.price)
		setInStock(item.inStock)
		setItemCategory(item.categoryID)
		setEditID(item.id)
	}

	const handleEditSubmit = async () => {
		console.log(editID)
		setAdd(false)
		setEditOpen(false)
		console.log(newName, qty, price, inStock, itemCategory)
		const tokenCheck = localStorage.getItem('Token')
		const response = await fetch(
			`http://yd-dev-elb-841236067.ap-south-1.elb.amazonaws.com/api/store-manager/item/${editID}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: tokenCheck as string,
				},
				body: JSON.stringify({
					name: newName,
					baseQuantity: qty,
					price: Number(price),
					inStock: inStock,
					category: Number(itemCategory),
					imageId: editID.itemImageLinks,
				}),
			}
		)
		setNewName('')
		setQty('')
		setPrice('')
		setInStock(true)
		setItemCategory(1)
		setUpdate(!update)
		setEditID('')
	}

	const handleEditCancel = () => {
		setEditOpen(false)
		setAdd(false)
	}

	const handleInStock = async (item: any) => {
		console.log(item.inStock)
		const tokenCheck = localStorage.getItem('Token')
		const response = await fetch(
			`http://yd-dev-elb-841236067.ap-south-1.elb.amazonaws.com/api/store-manager/item/${item.id}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: tokenCheck as string,
				},
				body: JSON.stringify({
					name: item.name,
					baseQuantity: item.baseQuantity,
					price: item.price,
					inStock: !item.inStock,
					category: item.categoryID,
					imageId: item.itemImageLinks,
				}),
			}
		)
		setUpdate(!update)
	}

	//---------------------------------------------------------------
	return (
		<Box
			sx={{
				background:
					'transparent linear-gradient(180deg, #FFECD7 0%, #FFC9C9 100%) 0% 0% no-repeat',
				height: '1000vh',
			}}>
			<Box>
				<Stack
					sx={{
						backgroundColor: '#F88A12',
						height: '8vh',
						justifyContent: 'space-between',
					}}
					direction='row'
					spacing={120}>
					<Stack direction='row' spacing={1}>
						<Image src={logo} alt='Your Daily logo' />
						<Typography
							sx={{
								color: 'white',
								paddingTop: '2vh',
								fontSize: '2.5vh',
								fontWeight: '600',
							}}>
							Dashboard
						</Typography>
					</Stack>
					<Box
						sx={{
							// border: '1px solid red',
							padding: '2vh',
						}}>
						<Button variant='text' sx={{ color: 'white' }}>
							<PersonAddAltIcon></PersonAddAltIcon>
						</Button>
						<Button
							variant='text'
							onClick={logoutUser}
							sx={{
								color: 'white',
							}}>
							<LogoutIcon></LogoutIcon>
						</Button>
					</Box>
				</Stack>
				<Stack
					sx={{
						margin: '3vh 10vw',
						justifyContent: 'space-around',
					}}
					direction='row'
					spacing={2}>
					<Button variant='outlined'>Back</Button>
					<Typography variant='h3'> Items</Typography>
					<Button variant='outlined' onClick={handleAddOpen}>
						+ Add new Items
					</Button>
					<>
						<Dialog open={addOpen} onClose={handleAddCancel}>
							<DialogTitle>Add Item</DialogTitle>
							<DialogContent>
								<DialogContentText>
									To add a new item, insert the new values and click on the
									submit button
								</DialogContentText>
								<TextField
									autoFocus
									id='item-name'
									label='Name'
									variant='standard'
									fullWidth
									margin='dense'
									onChange={(event) => setNewName(event.target.value)}
								/>
								<Stack
									sx={{
										flexDirection: 'row',
									}}>
									<TextField
										autoFocus
										id='base_qty'
										label='Base Quantity'
										variant='standard'
										margin='dense'
										onChange={(event) => setQty(event.target.value)}
									/>
									<TextField
										autoFocus
										id='price'
										label='Price'
										variant='standard'
										margin='dense'
										sx={{ marginLeft: '2vw' }}
										onChange={(event) => setPrice(event.target.value)}
									/>
								</Stack>
								<Stack
									sx={{
										marginTop: '2vh',
										flexDirection: 'row',
									}}>
									<Select
										labelId='category'
										id='Item Category'
										value={itemCategory}
										label='Age'
										onChange={(event) => {
											setItemCategory(Number(event.target.value))
										}}>
										<MenuItem value={1}>Vegetable</MenuItem>
										<MenuItem value={2}>Fruit</MenuItem>
										<MenuItem value={69}>Other</MenuItem>
									</Select>
									<Select
										labelId='stock'
										id='In Stock'
										value={inStock}
										label='Age'
										sx={{
											marginLeft: '4vw',
										}}
										onChange={(event) =>
											setInStock(event.target.value === 'true' ? true : false)
										}>
										<MenuItem value={'true'}>In Stock</MenuItem>
										<MenuItem value={'false'}>Not In Stock</MenuItem>
									</Select>
								</Stack>
							</DialogContent>
							<DialogActions>
								<Button onClick={handleAddCancel}>Cancel</Button>
								<Button onClick={handleAddSubmit}>Submit</Button>
							</DialogActions>
						</Dialog>
					</>
				</Stack>
				<Stack sx={{ flexDirection: 'row', justifyContent: 'center' }}>
					<Tabs
						value={1}
						// onChange={handleChange}
						textColor='inherit'
						indicatorColor='secondary'
						aria-label='secondary tabs example'
						sx={{
							margin: '0 10vw',
						}}>
						<Tab
							value='All_Items'
							label='All Items'
							onClick={filterClickHandler}
						/>
						<Tab
							value='Vegetables'
							label='Vegetables'
							onClick={filterClickHandler}
						/>
						<Tab value='Fruits' label='Fruits' onClick={filterClickHandler} />
						<Tab value='Others' label='Others' onClick={filterClickHandler} />4
					</Tabs>
				</Stack>
				<Stack>
					{display.map((item: any) => {
						return (
							<Stack
								key={item.id}
								sx={{
									alignItems: 'center',
									justifyContent: 'space-around',
									marginLeft: '10vw',
									marginRight: '10vw',
									padding: '5vh 0',
									height: '6vh',
									borderBottom: '3px solid white',
								}}
								direction='row'
								spacing={2}>
								<Typography sx={{ width: '2vw', fontSize: '18px' }}>
									{item.id}
								</Typography>
								<Avatar
									src={item.itemImageLinks}
									variant='square'
									sx={{ width: '3vw', height: '3vw' }}
								/>
								<Typography sx={{ width: '5vw', fontSize: '18px' }}>
									{item.name}
								</Typography>
								<Typography sx={{ width: '3vw', fontSize: '18px' }}>
									{item.baseQuantity}
								</Typography>
								<Typography sx={{ width: '3vw', fontSize: '18px' }}>
									{item.price}
								</Typography>
								{item.inStock === true ? (
									<Checkbox
										sx={{
											color: 'Orange',
											'&.Mui-checked': {
												color: 'orange',
											},
										}}
										checked
										onClick={() => handleInStock(item)}
									/>
								) : (
									<Checkbox
										sx={{
											color: 'Orange',
											'&.Mui-checked': {
												color: 'orange',
											},
										}}
										onClick={() => handleInStock(item)}
									/>
								)}

								<Button
									variant='text'
									onClick={(event) => deleteHandler(item.id)}
									sx={{ width: '1vw' }}>
									<DeleteIcon />
								</Button>
								<Button
									variant='text'
									onClick={() => handleEditOpen(item)}
									sx={{ width: '1vw' }}>
									<EditIcon />
								</Button>
								<></>
							</Stack>
						)
					})}
				</Stack>

				<Snackbar
					open={clientOpen}
					autoHideDuration={6000}
					onClose={clientClose}>
					<Alert onClose={clientClose} severity='error' sx={{ width: '100%' }}>
						Client Error
					</Alert>
				</Snackbar>
				<Snackbar
					open={serverOpen}
					autoHideDuration={6000}
					onClose={serverClose}>
					<Alert onClose={serverClose} severity='error' sx={{ width: '100%' }}>
						Server Error
					</Alert>
				</Snackbar>
				<Snackbar
					open={success_open}
					autoHideDuration={6000}
					onClose={success_close}>
					<Alert
						onClose={success_close}
						severity='success'
						sx={{ width: '100%' }}>
						Data refreshed successfully
					</Alert>
				</Snackbar>
			</Box>{' '}
			<Dialog open={editOpen}>
				<DialogTitle>Edit Item</DialogTitle>
				<DialogContent>
					<DialogContentText>
						To edit an item, insert the new values and click on the submit
						button
					</DialogContentText>
					<TextField
						autoFocus
						id='item-name'
						label='Name'
						variant='standard'
						fullWidth
						value={newName}
						margin='dense'
						onChange={(event) => setNewName(event.target.value)}
					/>
					<Stack
						sx={{
							flexDirection: 'row',
						}}>
						<TextField
							autoFocus
							id='base_qty'
							label='Base Quantity'
							variant='standard'
							value={qty}
							margin='dense'
							onChange={(event) => setQty(event.target.value)}
						/>
						<TextField
							autoFocus
							id='price'
							label='Price'
							variant='standard'
							value={price}
							margin='dense'
							sx={{ marginLeft: '2vw' }}
							onChange={(event) => setPrice(event.target.value)}
						/>
					</Stack>
					<Stack
						sx={{
							marginTop: '2vh',
							flexDirection: 'row',
						}}>
						<Select
							labelId='category'
							id='Item Category'
							value={itemCategory}
							label='Age'
							onChange={(event) => {
								setItemCategory(Number(event.target.value))
							}}>
							<MenuItem value={1}>Vegetable</MenuItem>
							<MenuItem value={2}>Fruit</MenuItem>
							<MenuItem value={69}>Other</MenuItem>
						</Select>
						<Select
							labelId='stock'
							id='In Stock'
							value={inStock}
							label='Age'
							sx={{
								marginLeft: '4vw',
							}}
							onChange={(event) =>
								setInStock(event.target.value === 'true' ? true : false)
							}>
							<MenuItem value={'true'}>In Stock</MenuItem>
							<MenuItem value={'false'}>Not In Stock</MenuItem>
						</Select>
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleEditCancel}>Cancel</Button>
					<Button onClick={handleEditSubmit}>Submit</Button>
				</DialogActions>
			</Dialog>
		</Box>
	)
}

export default Dashboard
