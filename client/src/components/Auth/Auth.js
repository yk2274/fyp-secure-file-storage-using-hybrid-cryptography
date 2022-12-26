import React, { useState, useEffect } from 'react'
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core'
import  LockOutlinedIcon  from '@material-ui/icons/LockOutlined'
import Input from './Input'
import useStyles from './styles'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { signin, signup } from '../../actions/auth'

const initialState = { firstname: '', lastname: '', password: '', confirmPassword: ''}

const Auth = () => {
    const classes = useStyles()
    const dispatch = useDispatch()
    const history = useHistory() 
    const errorMsg = useSelector((state) => state.error)
    const [isSignup,setIsSignup] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState(initialState)

    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword)

    const handleSubmit = (e) => {
        e.preventDefault()
        if(isSignup) {
            dispatch(signup(formData,history))
        } else {
            dispatch(signin(formData,history))
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value})
    }

    const switchMode = () => {
        setIsSignup((prevIsSignup) => !prevIsSignup)
        handleShowPassword(false)
    }
    
    return (
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={3}>
                {errorMsg && <Typography>{errorMsg}</Typography>}
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography variant="h5">{isSignup ? 'Sign Up' : 'Sign In'}</Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {
                            isSignup && (
                                <>
                                    <Input name="firstname" label="First Name" handleChange={handleChange} half />
                                    <Input name="lastname" label="Last Name" handleChange={handleChange} half /> 
                                </>
                            )
                        }
                            <Input name="email" label="Email Address" handleChange={handleChange} type="email" />
                            <Input name="password" label="Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} />
                            {isSignup && <Input name="confirmPassword" label="Confirm Password" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} /> }
                    </Grid>
                   
                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit} onSubmit={handleSubmit}>
                        {isSignup ? "Register" : "Login"}
                    </Button>
                
                    <Grid container justify='flex-end' style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <Grid item>
                            <Button onClick={switchMode}>
                                { isSignup ? "Already have an account? Sign In" : "Register an account"}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    )
}

export default Auth