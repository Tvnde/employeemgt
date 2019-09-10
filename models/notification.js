const mongoose = require("mongoose");

const NotificationSchema = mongoose.Schema({
    DateCreated: {
        type: Date,
        required: true
    },
    NotificationType: {
        type: String,
        required: true
    },
    TypeID: {
        type: Number,
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
    Read: {
        type: Boolean,
        required: true
    },
    TimeRead:{
        type: Date
    }
})

const Notification = module.exports = mongoose.model('Notification', NotificationSchema);