const mongoose = require('mongoose')
const PostMessage = require('../models/postMessage.js')
const logic = require('../cryptologic.js')
const crypto = require('crypto')
const User = require('../models/user.js')
const sharedFile = require('../models/sharedFile.js')

const getPosts = async (req, res) => { 
  try {
    const { ownerId } = req.params
    const postMessages = await PostMessage.find({ownerId});
    
    //generate sharedkey
    const existingUser = await User.findOne({"_id" : ownerId})
    if (!existingUser) return res.status(404).json({message: "User not found"})
    const privkey = existingUser.privkey
    const decprivkey = logic.decryption(privkey, process.env.KEY)
    const alice = crypto.createECDH('secp256k1')
    alice.setPrivateKey(decprivkey, 'base64')
    const sharedKey = alice.computeSecret(alice.getPublicKey().toString('base64'), 'base64', 'hex')
    
    // console.log(postMessages)
    for(x of postMessages) {
      const decrypted = logic.decryption(x.selectedFile, sharedKey)
      x.selectedFile = decrypted      
    }
    res.status(200).json(postMessages);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

const createPost = async (req, res) => {
  const { filename, selectedFile, ownerId } = req.body
  
  //generate sharedkey
  const existingUser = await User.findOne({"_id" : ownerId})
  if (!existingUser) return res.status(404).json({message: "User not found"})
  const privkey = existingUser.privkey
  const decprivkey = logic.decryption(privkey, process.env.KEY)
  const alice = crypto.createECDH('secp256k1')
  alice.setPrivateKey(decprivkey, 'base64')
  const sharedKey = alice.computeSecret(alice.getPublicKey().toString('base64'), 'base64', 'hex')
  
  const encrypted_file = logic.encryption(selectedFile, sharedKey)
  const newPostMessage = new PostMessage({ filename, selectedFile: encrypted_file, ownerId })

  try {
      await newPostMessage.save();

      res.status(201).json(newPostMessage);
  } catch (error) {
      res.status(409).json({ message: error.message });
  }
}

const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

  await PostMessage.findByIdAndRemove(id);
  await sharedFile.deleteMany({"fileId" : id})
  res.json({ message: "Post deleted successfully." });
}

const downloadPost = async (req, res) => {
  const { id } = req.params;

  try {
      const post = await PostMessage.findById(id)
      
      //generate sharedkey
      const existingUser = await User.findOne({"_id" : post.ownerId})
      if (!existingUser) return res.status(404).json({message: "User not found"})
      const privkey = existingUser.privkey
      const decprivkey = logic.decryption(privkey, process.env.KEY)
      const alice = crypto.createECDH('secp256k1')
      alice.setPrivateKey(decprivkey, 'base64')
      const sharedKey = alice.computeSecret(alice.getPublicKey().toString('base64'), 'base64', 'hex')
      
      const decrypted = logic.decryption(post.selectedFile, sharedKey)
      post.selectedFile = decrypted
      res.status(200).json(post);
  } catch (error) {
      res.status(404).json({ message: error.message });
  }

}

module.exports = {getPosts,createPost,deletePost,downloadPost}

