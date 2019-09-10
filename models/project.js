const mongoose = require("mongoose");

const ProjectSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    team: {
        type: Array
    },
    deadline: {
        type: Date,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    shutdown: {
        type: Boolean,
        required: true
    }
})

const Project = module.exports = mongoose.model('Project', ProjectSchema);