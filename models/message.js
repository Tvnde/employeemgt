const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema({
    DateCreated: {
        type: Date,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    Sender:{
        type: Object,
        required: true
    },
    Receiver:{
        type: Object,
        required: true
    },
    Read: {
        type: Boolean,
        required: true
    },
    TimeRead:{
        type: Date
    }
})

const Message = module.exports = mongoose.model('Message', MessageSchema);