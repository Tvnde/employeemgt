const mongoose = require("mongoose");

const DepartmentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    members: {
        type: Array
    },
    company: {
        type: String,
        required: true
    }
})

const Department = module.exports = mongoose.model('Department', DepartmentSchema);