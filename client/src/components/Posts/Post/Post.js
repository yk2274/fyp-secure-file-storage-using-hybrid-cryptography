import React from 'react';
import { Card, CardActions, CardContent, CardMedia, Button, Typography } from '@material-ui/core/';
import DeleteIcon from '@material-ui/icons/Delete';
import GetApp from '@material-ui/icons/GetApp';
import moment from 'moment';
import CustomizedDialogs from '../../whitelist/whitelist'
import { useDispatch } from 'react-redux';
import { downloadPost, deletePost } from '../../../actions/posts';
import useStyles from './styles';

const Post = ({ post, setCurrentId}) => {
  const dispatch = useDispatch();
  const classes = useStyles();

  
  return (
    <Card className={classes.card}>
      <CardMedia className={classes.media} image={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} title={post.title} />
      <div className={classes.overlay}>
        <Typography variant="body2">{moment(post.createdAt).fromNow()}</Typography>
      </div>
      <div className={classes.overlay2}>
        <CustomizedDialogs postId={post._id} />
      </div>
      <CardContent>
        <Typography className={classes.title} gutterBottom variant="h6" component="h2">{post.filename}</Typography>
      </CardContent>
      <CardActions className={classes.cardActions}>
        <Button size="small" color="primary" onClick={() => dispatch(downloadPost(post._id))}><GetApp fontSize="small" /> Download</Button>
        <Button size="small" color="primary" onClick={() => dispatch(deletePost(post._id))}><DeleteIcon fontSize="small" /> Delete</Button>
      </CardActions>
    </Card>
  );
};

export default Post;
