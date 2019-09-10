const mongoose = require("mongoose");

const LeaveRequestSchema = mongoose.Schema({
    RequestedBy: {
        type: Object,
        required: true
    },
    Basis: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    DateRequested: {
        type: Date,
        required: true
    },
    Duration: {
        type: String,
        required: true
    },
    Approval:{
        type: Number
    }
})

const LeaveRequest = module.exports = mongoose.model('LeaveRequest', LeaveRequestSchema);