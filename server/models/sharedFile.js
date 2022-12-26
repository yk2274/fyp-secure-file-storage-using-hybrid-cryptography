const mongoose = require('mongoose')

const sharedSchema = mongoose.Schema({
    sender: String,
    sender_pub: String,
    receiver: String,
    receiver_pub: String,
    fileId: String, 
    filename: String,
    file: String,
    createdAt: {
        type: Date,
        default: new Date(),
    },
})

module.exports = mongoose.model('SharedFile', sharedSchema);
