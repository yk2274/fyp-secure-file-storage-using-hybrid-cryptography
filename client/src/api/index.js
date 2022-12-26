import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' })


API.interceptors.request.use((req) => {
    if(localStorage.getItem('profile')) {
        req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`
    }
    return req
})
export const fetchPosts = (ownerId) => API.get(`/posts/getPosts/${ownerId}`); 
export const createPost = (newPost) => API.post(`/posts/createPosts`, newPost);
export const downloadPost = (id) => API.get(`/posts/downloadPost/${id}`);
export const deletePost = (id) => API.delete(`/posts/${id}`);

export const signIn = (formData) => API.post('/user/signin', formData)
export const signUp = (formData) => API.post('/user/signup', formData)

export const checkWhitelist = (email) => API.post('/whitelist/checkWhitelist', email) 
export const addWhitelist = (postId, email) => API.post(`/whitelist/addWhitelist/${postId}`, email) 
export const fetchWhitelist = (postId) => API.get(`/whitelist/fetchWhitelist/${postId}`)
export const deleteWhitelist = (email, postId) => API.delete(`/whitelist/deleteWhitelist/${postId}/${email}`)
export const downloadShared = (fileId, email) => API.get(`/whitelist/downloadShared/${fileId}/${email}`);
