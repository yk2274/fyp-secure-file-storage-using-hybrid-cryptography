import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogActions from '@material-ui/core/DialogActions';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogContentText from '@material-ui/core/DialogContentText'
import ShareRounded from '@material-ui/icons/ShareRounded';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import useStyles from './styles'
import { TextField, Button } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { checkWhitelist, addWhitelist, getWhitelist, deleteWhitelist } from '../../actions/whitelist';
import DeleteIcon from '@material-ui/icons/Delete';

const CustomizedDialogs = ({postId}) => {
  const [email, setEmail] = React.useState({email: ''})
  const [open, setOpen] = React.useState(false)
  const [user, setUser] = React.useState(false)
  const [scroll, setScroll] = React.useState('paper')
  const classes = useStyles()
  const dispatch = useDispatch()
  const whitelists = useSelector((state) => state.whitelist)


  const handleClickOpen = () => {
    setOpen(true)
    dispatch(getWhitelist(postId))
  }
  
  const handleClose = () => {
    setOpen(false)
  }

  

  const handleOnCheck = async (e) => {
    e.preventDefault()
    const result = await dispatch(checkWhitelist(email))
    if (result === true) {
      setUser(true)
    } else {
      setUser(false)
    }
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    //email and postId are not undefined 
    dispatch(addWhitelist(postId, email))
  }

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <div>
      <Button style={{ color : 'white' }} size="small" onClick={handleClickOpen}>
        <ShareRounded />
      </Button>
      
      <Dialog open={open} aria-labelledby="customized-dialog-title" aria-describedby="customized-dialog-description" fullWidth>

        <MuiDialogTitle id="customized-dialog-title">
          <Typography variant='h5'>Whitelist</Typography>
          <CloseIcon className={classes.closeButton} onClick={handleClose} />
        </MuiDialogTitle>
        <MuiDialogContent dividers={scroll === 'paper'}>
          <MuiDialogContentText id="customized-dialog-description" ref={descriptionElementRef} tabIndex={-1}>
            <ul>
              {whitelists.map((whitelist) => 
                <li>
                  <>{whitelist}</>
                  <Button onClick={() => dispatch(deleteWhitelist(whitelist, postId))}><DeleteIcon/></Button>
                </li>
              )}
            </ul>
          </MuiDialogContentText>
        </MuiDialogContent>
        <MuiDialogActions>
          <TextField name="email" variant="outlined" label="Email" fullWidth value={email.email} onChange={(e) => setEmail({...email, email: e.target.value})}></TextField>
          
           
          { user ? 
            (user &&
              <>
                <Button style={{backgroundColor:"#39FF14"}} onClick={handleOnCheck}>Check</Button>
                <Button onClick={handleAdd} >Add</Button>
            </>) : (<>
                <Button onClick={handleOnCheck}>Check</Button> 
                <Button disabled={true}>Add</Button>
            </>)
          }

        </MuiDialogActions>
              
      </Dialog>
    </div>
  );
}

export default CustomizedDialogs
