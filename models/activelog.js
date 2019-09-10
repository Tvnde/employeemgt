const mongoose = require('mongoose');

const ActiveLogSchema = mongoose.Schema({
    DateCreated: {
        type: String,
        required: true
    },
    Text: {
        type: String,
        required: true
    },
    Company: {
        type: String,
        required: true
    },
    Department: {
        type: String
    },
    ViewType:{
        type: Number,
        required: true
    }
});

const ActiveLog = module.exports = mongoose.model('ActiveLog', ActiveLogSchema);   