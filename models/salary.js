const mongoose = require("mongoose");

const SalarySchema = mongoose.Schema({
    company: {
        type: String,
        required: true
    },
    EmployeeName:{
        type: String
    },
    EmployeeType: {
        type: Number,
        required: true
    },
    Allowances: {
        type: Object,
        required: true
    }
    
})

const Salary = module.exports = mongoose.model('Salary', SalarySchema);