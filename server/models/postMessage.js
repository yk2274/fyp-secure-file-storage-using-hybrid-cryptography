const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    ownerId: String,
    filename: String,
    selectedFile: String,
    createdAt: {
        type: Date,
        default: new Date(),
    },
    whitelist: []
})

module.exports = mongoose.model('PostMessage', postSchema);

