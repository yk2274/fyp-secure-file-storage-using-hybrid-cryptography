import React from 'react'
import { AppBar, Avatar, Button, Toolbar, Typography } from '@material-ui/core'
import memories from '../../images/memories.png'
import useStyles from './styles'
import { useHistory, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useState, useEffect } from 'react'
import decode from 'jwt-decode'

export const Navbar = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const history = useHistory()
    const location = useLocation()
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')))

    const logout = () => {
        dispatch({ type: 'LOGOUT' })
        history.push('/')
        setUser(null)
    }

    useEffect( () => {
        const token = user?.token

        //if token expire then logout the user automatically
        if(token) {
            const decodedToken = decode(token)
            if(decodedToken.exp*1000 < new Date().getTime()) logout()
        }

        setUser(JSON.parse(localStorage.getItem('profile')))
    }, [location])

    return (
        <div>
            {user ? (
                <AppBar className={classes.userAppBar} position="static" color="inherit">
                    <div className={classes.brandContainer}>
                        <Typography className={classes.heading} variant="h2" align="center">Cloud Storage</Typography>
                        <img className={classes.image} src={memories} alt="icon" height="60" />
                    </div>
                    <Toolbar className={classes.toolbar}>
                        <div className={classes.profile}>
                            <Avatar className={classes.purple} alt={user.result.name} src={user.result.imageUrl}>{user.result.name.charAt(0)}</Avatar>
                            <Typography className={classes.userName} variant="h6">{user.result.name}</Typography>
                            <Button variant="contained" className={classes.logout} color="secondary" onClick={logout}>Logout</Button>
                        </div>
                    </Toolbar>
                </AppBar>
            ) : (
                <AppBar className={classes.appBar} position="static" color="inherit">
                    <div className={classes.brandContainer}>
                        <Typography className={classes.heading} variant="h2" align="center">Cloud Storage</Typography>
                        <img className={classes.image} src={memories} alt="icon" height="60" />
                    </div>
                </AppBar>
            )}
        </div>
        

        
    )
}

export default Navbar
