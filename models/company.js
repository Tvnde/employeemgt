const mongoose = require('mongoose');

const CompanySchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    mobile_no: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    company_logo: {
        type: String,
        required: true
    }

});

const Company = module.exports = mongoose.model('Company', CompanySchema);   