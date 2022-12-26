const express = require('express')
const { getPosts, createPost, downloadPost, deletePost } = require('../controllers/posts.js')
const auth = require('../middleware/auth')

const router = express.Router();

router.get('/getPosts/:ownerId', auth, getPosts);
router.post('/createPosts', auth, createPost);
router.get('/downloadPost/:id', auth, downloadPost);
router.delete('/:id', auth, deletePost);

module.exports = router