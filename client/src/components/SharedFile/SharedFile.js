import React, { useState, useEffect } from 'react'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { Grid, Button, Typography } from '@material-ui/core'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { downloadShared } from '../../actions/posts'

const SharedFile = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const history = useHistory()
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')))
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const errorMsg = useSelector((state) => state.error)
  
  let { sharedFileId } = useParams()
  useEffect(() => {
    const token = user?.token
    if(token) {
      setIsLoggedIn(true)
      const email = user?.result.email
      dispatch(downloadShared(sharedFileId, email))
    } else {
      setIsLoggedIn(false)
      alert("Please login before you click the download link")
      history.push('/')
    }
    setUser(JSON.parse(localStorage.getItem('profile')))
    
  },[location])

  return (
    <div  style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 200
    }}>

      <Grid container direction="column" justifyContent="space-between" alignItems="center" >
        {errorMsg ? <Typography variant='h4' style={{color:"white"}}>{errorMsg}</Typography> : <>
          {isLoggedIn ? <>
            <Typography variant='h4' style={{color:"white"}}>File downloaded successfully</Typography>
            <Link to={`/home/${user?.result._id}`}>
              <Button variant="contained"  style={{marginBottom: 10,  backgroundColor:'white' }} color="#01b7ff" >HOME</Button>
            </Link>
          </> : <div></div>}
        </>}
        
        
      </Grid>
        
    </div>
    
  )
}

export default SharedFile
