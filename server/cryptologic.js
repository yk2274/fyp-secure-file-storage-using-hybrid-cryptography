const crypto = require('crypto')

const encryption = (data, key) => {
    const IV = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key, 'hex'), IV)
    let encrypted = cipher.update(data, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    const auth_tag = cipher.getAuthTag().toString('hex')
    const payload = IV.toString('hex') + encrypted + auth_tag
    const payload64 = Buffer.from(payload, 'hex').toString('base64')
    
    return payload64
}

const decryption = (data, key) => {
    const payload = Buffer.from(data, 'base64').toString('hex')
    const payload_iv = payload.substr(0,32)
    const payload_encrypted = payload.substr(32, payload.length-32-32) 
    const payload_auth_tag = payload.substr(payload.length-32, 32)
    const decipher = crypto.createDecipheriv(
        'aes-256-gcm', 
        Buffer.from(key, 'hex'), 
        Buffer.from(payload_iv, 'hex')
    )
    decipher.setAuthTag(Buffer.from(payload_auth_tag, 'hex'))
    let decrypted = decipher.update(payload_encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
}

module.exports = {encryption, decryption}