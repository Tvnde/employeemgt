const mongoose = require('mongoose');

const EmployeeSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    department: {
        type: String,
    },
    level: {
        type: Number,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    dateofbirth: {
        type: String,
        required: true
    },
    mobile_no: {
        type: String,
        required: true
    },
    profilephoto: {
        type: String,
        required: true
    }
})

const Employee = module.exports = mongoose.model('Employee', EmployeeSchema);   