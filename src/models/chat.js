const mongoose = require('mongoose')
const validator = require('validator')

const ChatSchema = mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true
    },
    sendBy: {
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'       
    },
    users: Array
}, { timestamps: true })

const Chat = mongoose.model('Chat', ChatSchema)

module.exports = Chat;