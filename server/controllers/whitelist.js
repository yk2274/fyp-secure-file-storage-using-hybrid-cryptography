const mongoose = require('mongoose')
const logic = require('../cryptologic.js')
const crypto = require('crypto')
const PostMessage = require('../models/postMessage.js')
const User = require('../models/user.js')
const sharedFile = require('../models/sharedFile.js')
const nodemailer = require('nodemailer')

const fetchWhitelist = async (req, res) => { 
  try {
    const {id} = req.params
    const post = await PostMessage.findById(id)
    if(!post) return res.status(404).json({message: "Post not found"})
    res.status(200).json(post.whitelist)
    
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

const checkWhitelist = async (req, res) => { 
  try {
    const {email} = req.body
    const existingUser = await User.findOne({email})
    if (!existingUser) {
        return res.status(200).json(false)
    } else {
        return res.status(200).json(true)
    }
    
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

const addWhitelist = async (req, res) => {
  const { email } = req.body
  const { id } = req.params //postid
  
  try {

    const post = await PostMessage.findById(id)
    const sender = await User.findById(post.ownerId)
    if (!sender) return res.status(404).json({message: "User not found"})
    const receiver = await User.findOne({email})
    if (!receiver) return res.status(404).json({message: "User not found"})
    // for (x of post.whitelist) {
    //     if (x === email) return res.status(400).json({message: "Duplicate email added"})
    // }
    post.whitelist.push(email)
    await post.save()

    const privkey = sender.privkey
    const decprivkey = logic.decryption(privkey, process.env.KEY)
    const alice = crypto.createECDH('secp256k1')
    alice.setPrivateKey(decprivkey, 'base64')
    const sharedKey = alice.computeSecret(alice.getPublicKey().toString('base64'), 'base64', 'hex')
    const decFile = logic.decryption(post.selectedFile, sharedKey)

    const sharedKey_SharedFile = alice.computeSecret(receiver.pubkey, 'base64', 'hex')
    const enSharedFile = logic.encryption(decFile, sharedKey_SharedFile)

    const newSharedFile = await sharedFile.create({
        sender: sender.email,
        sender_pub: sender.pubkey,
        receiver: receiver.email,
        receiver_pub: receiver.pubkey,
        fileId: post._id, 
        filename: post.filename,
        file: enSharedFile,
    })

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        secure: false,
        auth: {
            user: process.env.AUTH_EMAIL,
            pass: process.env.AUTH_PASS,
        },
        tls: {rejectUnauthorized: false}
        
    })
    
    const frontendUrl = "http://localhost:3000"

    let mailOption = {
    from: process.env.AUTH_EMAIL,
    to: newSharedFile.receiver,
    subject: `${newSharedFile.sender} has added you into whitelist of file: "${newSharedFile.filename}"`,
    html: `<p><a href="${frontendUrl + "/download_shared_file/" + newSharedFile._id}"> ${frontendUrl + "/download_shared_file/" + newSharedFile._id} </a></p>
        <p>Click this link to download</p>`
    }

    transporter.sendMail(mailOption, function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log('Email sent successfully');
    }
    })
 
    res.status(201).json(email);
  } catch (error) {
    res.status(404).json({ message: error.message })
  }

  
}

const deleteWhitelist = async (req, res) => {
  const { id, email } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);

  const post = await PostMessage.findById(id);
  let index = 0
  for (x of post.whitelist) {
    if (x === email) {
      post.whitelist.splice(index,1)
    }
    index++
  }
  await post.save()

  //delete in sharedFile mongodb
  const sharedfiles = await sharedFile.find({"fileId": id})
  let sharedfileId = "nothinghere"
  for (x of sharedfiles) {
    if (x.receiver === email) {
      sharedfileId = x._id
    }
  }
  await sharedFile.findByIdAndRemove(sharedfileId)
  res.json({ message: "Whitelist deleted successfully." });
}

const downloadShared = async (req, res) => {
  const { email, id } = req.params;

  try {
      const file = await sharedFile.findById(id);
      if (!file) return res.status(404).json({message: "Shared file not found"})
      if (!(file.receiver === email)) return res.status(401).json({message: "Unauthorized user"})
      
      //decrypt file
      const receiver = await User.findOne({email})
      if (!receiver) return res.status(404).json({message: "receiver not found"})
      const privkey = receiver.privkey
      const decprivkey = logic.decryption(privkey, process.env.KEY)
      const alice = crypto.createECDH('secp256k1')
      alice.setPrivateKey(decprivkey, 'base64')
      const sharedKey_SharedFile = alice.computeSecret(file.sender_pub, 'base64', 'hex')
      const decFile = logic.decryption(file.file, sharedKey_SharedFile)
      file.file = decFile
      res.status(200).json(file);

  } catch (error) {
      res.status(404).json({ message: error.message });
  }

}

module.exports = {checkWhitelist, addWhitelist, deleteWhitelist, downloadShared, fetchWhitelist}