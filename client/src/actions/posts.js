import { FETCH_ALL, CREATE, DELETE, ERROR, CLEAN } from '../constants/actionTypes';
import { triggerBase64Download } from "common-base64-downloader-react";

import * as api from '../api/index.js';


export const getPosts = (ownerId) => async (dispatch) => {
  try {
    const { data } = await api.fetchPosts(ownerId);

    dispatch({ type: FETCH_ALL, payload: data });
    
  } catch (error) {
    console.log(error.message);
  }
};

export const createPost = (post) => async (dispatch) => {
  try {
    const { data } = await api.createPost(post);

    dispatch({ type: CREATE, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};

export const downloadPost = (id) => async () => {
  try {
    
    const { data } = await api.downloadPost(id);
    triggerBase64Download(data.selectedFile, data.filename)

  } catch (error) {
    console.log(error.message);
  }
};

export const downloadShared = (fileId, email) => async (dispatch) => {
  try {
    
    const { data } = await api.downloadShared(fileId, email);
    dispatch({type: CLEAN, action: null})
    triggerBase64Download(data.file, data.filename)

  } catch (error) {

    const message = error.response.data.message
    dispatch({type: ERROR, message})  
  }
};

export const deletePost = (id) => async (dispatch) => {
  try {
    
    await api.deletePost(id);

    dispatch({ type: DELETE, payload: id });
  } catch (error) {
    console.log(error.message);
  }
};
