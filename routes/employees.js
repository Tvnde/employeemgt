const express = require('express');
const router = express.Router();
const users = require('../models/user');
const bcrypt = require('bcryptjs');
const employees = require('../models/employee');
const notifications = require('../models/notification');
const leaverequests = require('../models/leaverequest');
const activities = require('../models/activelog');
const messages = require('../models/message');
const salaries = require('../models/salary');

const EmployeeController = require('../controllers/employees');

router.get('/dashboard', (req, res)=>{
    employees.findOne({username: req.user.username}, (err, employee)=>{
        res.render('staffdashboard',{
            user: req.user,
            employee: employee
        })
    })
});

router.get('/leavereq', (req, res)=>{
    employees.find({name: req.user.name, username: req.user.username}, (err, employee)=>{
        res.render('requestleave',{
            user: req.user,
            employee: employee[0]
        })
    })
});

router.post('/leavereq', (req, res)=>{
    employees.find({username: req.user.username}, (err, employee)=>{
        AddNotifications = new notifications();
        AddNotifications.DateCreated = new Date();
        AddNotifications.NotificationType = "Leave Request";
        AddNotifications.TypeID = 3;
        AddNotifications.company = employee[0].company;
        AddNotifications.Sender = employee[0];
        AddNotifications.Read = false;
        AddNotifications.save((err)=>{
            if(err) console.log(err);
            else{
                AddLeaveRequest = new leaverequests();
                AddLeaveRequest.RequestedBy = employee[0];
                AddLeaveRequest.Basis = req.body.reason;
                AddLeaveRequest.company = employee[0].company;
                AddLeaveRequest.DateRequested = new Date().toUTCString();
                AddLeaveRequest.Duration = req.body.duration_number+" "+req.body.format;
                AddLeaveRequest.Approval = 0;
                AddLeaveRequest.save((err)=>{
                    if(err) console.log(err);
                    else{
                        AddLog = new activities();
                        AddLog.DateCreated = new Date().toUTCString();
                        AddLog.Text = req.user.name+"("+employee[0].department+") has requested for a Leave of "+AddLeaveRequest.Duration;
                        AddLog.Department = employee[0].department;
                        AddLog.Company = employee[0].company;
                        AddLog.ViewType = 2;

                        AddLog.save((err)=>{
                            if(err) console.log(err);
                            else{
                                req.flash("success", "Your request has been sent");
                                res.redirect('/employee/dashboard');
                            }
                        })
                    }
                })
            }
        })
    })


})

router.get('/viewleave', EmployeeController.viewleave);

router.get('/viewmessages', (req, res)=>{
    if(req.isAuthenticated()){
        employees.findOne({username: req.user.username}, (err, employee)=>{
            messages.find({Receiver: employee},(err, user_messages)=>{
                console.log(user_messages);
            })
        })
    }
});

router.get('/:leaveID/accept', (req, res)=>{
    if(req.isAuthenticated() && req.user.user_type==3){
        leaverequests.findByIdAndUpdate(req.params.leaveID, {$set:{Approval: 1}}, {useFindAndModify: false}, (err, leaverequest)=>{
            if(err) console.log(err);
            else{
                req.flash("success", "Leave Approved");
                res.redirect('/employee/viewleave');
            }
        })
    }
});

router.get('/:leaveID/reject', (req, res)=>{
    if(req.isAuthenticated() && req.user.user_type==3){
        leaverequests.findByIdAndUpdate(req.params.leaveID, {$set: {Approval: -1}}, {useFindAndModify: false}, (err, leaverequest)=>{
            if(err) console.log(err);
            else{
                req.flash("danger", "Leave Declined");
                res.redirect('/employee/viewleave');
            }
        })
    }
});

router.get('/payslip', (req, res)=>{
    if(req.isAuthenticated() && req.user.user_type==1||req.user.user_type==3){
        employees.findOne({username: req.user.username}, (err, employee)=>{
            salaries.findOne({EmployeeName: req.user.username}, (err, salary)=>{
                if(salary!=null){
                    console.log("+"+salary);
                    res.render('staffrollview',{
                        user: req.user,
                        employee: employee,
                        payroll: salary
                    })
                }
                else{
                    salaries.findOne({EmployeeType: employee.level}, (err, staff_salary)=>{
                        console.log("-"+staff_salary);
                        res.render('staffrollview',{
                            user: req.user,
                            employee: employee,
                            payroll: staff_salary
                        })
                    })
                }
            })
        })
    }
})


module.exports = router;