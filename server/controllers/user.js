const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const crypto = require('crypto')
const logic = require('../cryptologic')

const signin = async (req, res) => {
    const { email, password } = req.body

    try {
        
        const existingUser = await User.findOne({email})
        if (!existingUser) return res.status(404).json({message: "User not found"})
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)
        if (!isPasswordCorrect) return res.status(400).json({message: "Invalid credential"})
        const token = jwt.sign({email: existingUser.email , id: existingUser._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE})
        res.status(200).json({ result: existingUser, token})

    } catch (error) {
        res.status(500).json({ message: error})
    }
}

const signup = async (req, res) => {
    const { firstname, lastname, email, password, confirmPassword } = req.body
    try {

        const existingUser = await User.findOne({email})
        if (existingUser) return res.status(400).json({message: "User with this email already has an account"})
        if (password != confirmPassword) return res.status(400).json({message: "Passwords don't match"})
        const hashedPassword = await bcrypt.hash(password, 10)

        //generate key for new user
        const alice = crypto.createECDH('secp256k1')
        alice.generateKeys()
        const privkey = alice.getPrivateKey().toString('base64')
        const pubkey = alice.getPublicKey().toString('base64')
        const encryptedpriv = logic.encryption(privkey, process.env.KEY)
    
        const newUser = await User.create({
            email, 
            password: hashedPassword, 
            name: `${firstname} ${lastname}`,
            privkey: encryptedpriv,
            pubkey
        })
        const token = jwt.sign({email: newUser.email, id: newUser._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRE})
        res.status(200).json({ result: newUser, token})

    } catch (error) {
        res.status(500).json({ message: error})
    }
}   

module.exports = {signin,signup}