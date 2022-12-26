const express = require('express')
const { checkWhitelist, addWhitelist, downloadShared, deleteWhitelist, fetchWhitelist } = require('../controllers/whitelist.js')
const auth = require('../middleware/auth')

const router = express.Router();

router.get('/fetchWhitelist/:id', auth, fetchWhitelist); 
router.post('/checkWhitelist', auth, checkWhitelist); //req.body, email
router.post('/addWhitelist/:id', auth, addWhitelist); //req.params, id -- req.body, email
router.get('/downloadShared/:id/:email', auth, downloadShared); 
router.delete('/deleteWhitelist/:id/:email', auth, deleteWhitelist);

module.exports = router