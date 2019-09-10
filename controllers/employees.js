const express = require('express');
const router = express.Router();
const users = require('../models/user');
const bcrypt = require('bcryptjs');
const employees = require('../models/employee');
const notifications = require('../models/notification');
const leaverequests = require('../models/leaverequest');
const activities = require('../models/activelog');

exports.viewleave = (req, res)=>{
    if(req.isAuthenticated() && req.user.user_type==3){
        var dept_requests = [];
        employees.findOne({username: req.user.username, company: req.user.company}, (err, employee)=>{
            leaverequests.find({company: req.user.company}, (err, allrequests)=>{
                for(var w=0; w< allrequests.length; w++){
                    console.log(allrequests[w].RequestedBy.department);
                    console.log(employee.department);
                    if(allrequests[w].RequestedBy.department == employee.department){
                        dept_requests.push(allrequests[w]);
                    }
                }
                notifications.find({company: req.user.company}, (err, allnotifications)=>{
                    var counter = 0;
                    for(var d=0; d<allnotifications.length; d++){
                        if(allnotifications[d].Read==false)counter++;
                    }
                res.render('leaverequests',{
                    user: req.user,
                    notifications: allnotifications,
                    staffs: employee,
                    leaverequests: dept_requests,
                    numRead: counter
                })
            })
            })
        })
    }
}
