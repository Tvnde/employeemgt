const express = require('express');
const router = express.Router();
const users = require('../models/user');
const bcrypt = require('bcryptjs');
const employees = require('../models/employee');
const multer = require('multer');
const path = require('path');
const departments = require('../models/department');
const projects = require('../models/project');
const notifications = require('../models/notification');
const leaverequests = require('../models/leaverequest');
const companies = require('../models/company');
const messages = require('../models/message');
const activities = require('../models/activelog');
const salaries = require('../models/salary');

const Employeestorage = multer.diskStorage({
    destination: './assets/img/staff',
    filename: (req, file, callback) => {
        callback(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname));
    }
})

const Employeeupload = multer({
    storage: Employeestorage
})

router.get('/dashboard', (req, res)=>{
    if(req.user!=undefined && req.user.user_type==2){
        notifications.find({company: req.user.company}, (err, allnotifications)=>{
            activities.find({Company: req.user.company}, (err, activitylogs)=>{
                employees.findOne({username: req.user.username, company: req.user.company}, (err, employee)=>{

                    var noRead = 0;
                    for(var i=0; i< allnotifications.length; i++){
                        if(allnotifications.Read==false) noRead++;
                    }
                    res.render('hrdashboard',{
                        user: req.user,
                        notifications: allnotifications,
                        activelogs: activitylogs,
                        numRead: noRead,
                        employee: employee
                    })    
                })
            })
           
        })
    }
    else{
        res.redirect('/unauthorized');
    }
});
router.get('/staffs', (req, res)=>{
    if(req.isAuthenticated() && req.user.user_type==2){
        var employee = {};
        notifications.find({company: req.user.company}, (err, allnotifications)=>{
            employees.find({company: req.user.company}, (err, employees)=>{
                for(var j=0; j< employees.length;j++){
                    if(employees[j].username == req.user.username){
                        employee = employees[j];
                        break;
                    }
                }
                console.log(employees);
                console.log(employee);
                var counter = 0;
                for(var d=0; d<allnotifications.length; d++){
                    if(allnotifications[d].Read==false)counter++;
                }
                res.render('viewstaffs',{
                    employees: employees,
                    user: req.user,
                    notifications: allnotifications,
                    counter: counter,
                    employee: employee
                })
            })
        })
    }else res.redirect('/unauthorized');
});

router.get('/departments', (req, res)=>{
    employees.findOne({username: req.user.username}, (err, employee)=>{
        departments.find({company: req.user.company}, (err, alldepts)=>{
            notifications.find({company: req.user.company}, (err, allnotifications)=>{
                var counter = 0;
                for(var d=0; d<allnotifications.length; d++){
                    if(allnotifications[d].Read==false)counter++;
                }
                var holder = {};
                for(var checker=0; checker<alldepts.length; checker++){
                    holder[alldepts[checker].name] = alldepts[checker].members;
    
                }
                console.log(holder);
                res.render('viewdepartments',{
                    departments: alldepts,
                    user: req.user,
                    members: holder,
                    counter: counter,
                    notifications: allnotifications,
                    employee: employee
                });
            })
        })
    })
})

router.get('/viewdept:deptID', (req, res)=>{
    var holder = [];
    var employee;
    var hod;
    departments.findById(req.params.deptID, (err, department)=>{
        users.find({user_type: 3},(err, allhods)=>{
            console.log(allhods);
            
        employees.find({company: req.user.company}, (err, allemployees)=>{
            for(var s=0; s< allemployees.length; s++){
                if(allemployees[s].department == department.name){
                    holder.push(allemployees[s]);
                }
                if(allemployees[s].username == req.user.username) employee = allemployees[s];
            }
            console.log(holder);
            if(allhods.length>0){
                for(var n=0; n< allhods.length; n++){
                    for(var t=0; t< holder.length; t++){
                        if(allhods[n].username == holder[t].username){
                            console.log("true");
                            hod = holder[t];
                            break;
                        }
                    }
                    if(hod!=undefined) break;
                }
        } else hod = {};
            notifications.find({company: req.user.company}, (err, allnotifications)=>{
                var counter = 0;
                for(var d=0; d<allnotifications.length; d++){
                    if(allnotifications[d].Read==false)counter++;
                }
                console.log(employee);
                res.render('deptdetails',{
                    user: req.user,
                    employees: holder,
                    department: department,
                    employee: employee,
                    counter: counter,
                    notifications: allnotifications,
                    hod: hod
                })
            })
        })
        })
    })
});

router.get('/addstaff:deptID', (req, res)=>{
    if(req.isAuthenticated() && req.user.user_type==2){
        companies.findOne({username: req.user.company}, (err, company)=>{
            console.log(company);
            console.log(req.user.username);
            employees.findOne({username: req.user.username}, (err, employee)=>{
                departments.find({_id: req.params.deptID}, (err, department)=>{
                    console.log(department);
                    notifications.find({company: req.user.company}, (err, allnotifications)=>{
                        var counter = 0;
                        for(var d=0; d<allnotifications.length; d++){
                            if(allnotifications[d].Read==false)counter++;
                        }
                        console.log(counter);

                        res.render('addemployee',{
                            user: req.user,
                            departments: department,
                            notifications: allnotifications,
                            counter: counter,
                            employee: employee
                        })


                    })
                })
            })
        })
    }
})


router.get('/addstaff', (req, res)=>{
    employees.findOne({username: req.user.username}, (err, employee)=>{
        notifications.find({company: req.user.company}, (err, allnotifications)=>{
            var counter = 0;
            for(var d=0; d<allnotifications.length; d++){
                if(allnotifications[d].Read==false)counter++;
            }
            console.log(counter);
            departments.find({company: req.user.company}, (err, alldepts)=>{
                res.render('addemployee',{
                    user: req.user,
                    departments: alldepts,
                    notifications: allnotifications,
                    counter: counter,
                    employee: employee
                })    
            })
        })
    })
});

router.post('/addstaff', Employeeupload.single('profilephoto'),  (req, res)=>{
    employees.findOne({username: req.user.username, company: req.user.company}, (err, employee)=>{
        users.find({}, (err, allusers)=>{
            AddEmployee = new employees();
            AddEmployee.name = req.body.f_name+" "+req.body.l_name;
            AddEmployee.email = req.body.email;
            AddEmployee.company = req.user.company;
            AddEmployee.gender = req.body.gender;
            if(allusers.length>0){
                AddEmployee.username = "USER0"+(Math.floor(Math.random() * (99999 - 11111) + 11111).toString());
                for(var k=0; k< allusers.length; k++){
                    if(allusers[0].username == AddEmployee.username){
                        AddEmployee.username = "USER0"+(Math.floor(Math.random() * (99999 - 11111) + 11111).toString());
                    }
                }
            }else AddEmployee.username = "USER0"+(Math.floor(Math.random() * (99999 - 11111) + 11111).toString());
            AddEmployee.level = 01;
            AddEmployee.dateofbirth = req.body.dob;
            if(req.body.department!=undefined) AddEmployee.department = req.body.department;
            AddEmployee.mobile_no = req.body.mobile;
            AddEmployee.profilephoto = req.file.path.replace('assets\\img\\staff\\','../assets/img/staff/');
            AddEmployee.save((err)=>{
                if(err) console.log(err);
                else{
                    if(req.body.department!=undefined){
                        departments.find({name: req.body.department, company: req.user.company}, (err, thedept)=>{
                            var members = thedept[0].members;
                            members.push(AddEmployee);
                            departments.updateOne({name: req.body.department, company: req.user.company}, { $set: {members: members}}, (err, updated)=>{
                                console.log(updated);
                            })
                        })
                    }
                    AddUser = new users();
                    AddUser.name = AddEmployee.name;
                    AddUser.username = AddEmployee.username;
                    AddUser.email = AddEmployee.email;
                    AddUser.company = req.user.company;
                    if(req.body.department!=undefined){
                        if(req.body.department == "HR"){
                            AddUser.user_type=2;
                        }
                        else if(req.body.department=="Admin"){
                            AddUser.user_type=0;
                        }
                        else AddUser.user_type=1;
                    }
                    bcrypt.genSalt(10, (err, salt)=>{
                        bcrypt.hash(req.body.l_name.toLowerCase(), salt, (err, hash)=>{
                            if(err) console.log(err);
                            else AddUser.password = hash;
            
                            AddUser.save((err)=>{
                                if(err) console.log(err);
                                else{
                                    AddLog = new activities();
                                    AddLog.DateCreated = new Date();
                                    AddLog.Text = req.user.name+" added "+AddUser.name+"( Username: "+AddUser.username+") to "+req.body.department+" Department";
                                    AddLog.Company = req.user.company;
                                    AddLog.ViewType = 1;
                                    AddLog.save((err)=>{
                                        if(err) console.log(err);
                                        else{
                                            req.flash("success", "Staff has been added successfully");
                                            res.redirect('/hr/staffs');
                                        }
                                    })
                                }
                            });
                        });
                    });
                };
            });
        });
    });
});

router.get('/adddepts', (req, res)=>{
    if(req.isAuthenticated() && req.user.user_type==2){
        var employee={};
        companies.findOne({username: req.user.username},(err, company)=>{
            notifications.find({company: req.user.company}, (err, allnotifications)=>{
                var checker = 0;
                for(var t=0; t<allnotifications.length; t++){
                    if(allnotifications[t].Read == false)checker++;
                }
                employees.find({company: req.user.company}, (err, allstaffs)=>{
                    for(var t=0; t< allstaffs.length; t++){
                        if(allstaffs[t].username == req.user.username){
                            employee = allstaffs[t];
                            break;
                        }
                    }
                    res.render('adddepartments',{
                        user: req.user,
                        staffs: allstaffs,
                        notifications: allnotifications,
                        counter: checker,
                        company: company,
                        employee: employee
                    });
                });

            });
        });
    }
});

router.post('/adddepts', (req, res)=>{
    if(req.isAuthenticated() && req.user.user_type==2){
        employees.find({company:req.user.company}, (err, allstaffs)=>{
            if(err) console.log(err);
            else{
                var employee = {};
                AddDepartment = new departments();
                AddDepartment.name = req.body.dept_name;
                AddDepartment.type= req.body.dept_type;
                AddDepartment.description = req.body.description;
                var members=[];
                for(var f=0; f< allstaffs.length; f++){
                    if(req.user.username==allstaffs[f].username){
                        employee = allstaffs[f];
                        break;
                    }
                }
                for(var i=0; i< Object.keys(req.body).length; i++){
                    if(req.body["member"+i]!=undefined){
                        for(var j=0; j< allstaffs.length; j++){
                            if(req.body["member"+i]==allstaffs[j].name){
                                members.push(allstaffs[j]);
                                break;
                            }
                        }
                    }
                }
                AddDepartment.members = members;
                AddDepartment.company = req.user.company;
                AddDepartment.save((err)=>{
                    if(err) console.log(err);
                    else{
                        AddLog = new activities();
                        AddLog.DateCreated = new Date();
                        AddLog.Text = req.user.name+" created the Department "+AddDepartment.name;
                        AddLog.Company = req.user.company;
                        AddLog.ViewType = 1;
                        AddLog.save((err)=>{
                            if(err) console.log(err);
                            else{
                                res.redirect('/hr/departments');
                            }
                        })
                    }
                })
            }
        })
    }
});

router.get('/projects', (req, res)=>{
    if(req.isAuthenticated() && req.user.user_type==2){
        companies.findOne({username: req.user.company}, (err, company)=>{
            projects.find({company: req.user.company, shutdown: false}, (err, allprojects)=>{
                notifications.find({company: req.user.company}, (err, allnotifications)=>{
                    var checker = 0;
                    for(var t=0; t<allnotifications.length; t++){
                        if(allnotifications[t].Read == false)checker++;
                    }
                    console.log(req.user.company)
                    console.log(allprojects);
                    employees.findOne({company: req.user.company}, (err, employee)=>{
                        res.render('viewprojects',{
                            projects: allprojects,
                            user: req.user,
                            notifications: allnotifications,
                            company: company,
                            employee: employee,
                            counter: checker
                        });
                    });
                })
            })
        })
    }else res.redirect('/unauthorized');
})

router.get('/createproject', (req, res)=>{
    if(req.isAuthenticated() && req.user.user_type==2){
        var employee = {};
        departments.find({company: req.user.company},(err, alldepts)=>{
            notifications.find({company: req.user.company}, (err, allnotifications)=>{
                console.log(alldepts);
                var checker = 0;
                for(var t=0; t<allnotifications.length; t++){
                    if(allnotifications[t].Read == false)checker++;
                }
                employees.find({company: req.user.company}, (err, allstaffs)=>{
                    for(var x=0; x< allstaffs.length; x++){
                        if(allstaffs[x].username==req.user.username){
                            employee = allstaffs[x];
                            break;
                        }
                    }
                    console.log(allstaffs);
                    res.render('createproject',{
                        user: req.user,
                        departments: alldepts,
                        employees: allstaffs,
                        notifications: allnotifications,
                        employee: employee,
                        counter: checker
                    })
                })
            })
            
        })
    }
});

router.post('/createproject', (req, res)=>{
    if(req.isAuthenticated() && req.user.user_type==2){
        employees.find({company: req.user.company}, (err, allstaffs)=>{
            AddProject = new projects();
            AddProject.title = req.body.proj_title;
            AddProject.deadline = req.body.proj_duration;
            AddProject.company = req.user.company;
            AddProject.shutdown = false;
            var team = [];
            for(var i=0; i< Object.keys(req.body).length; i++){
                console.log(req.body['team'+i]);
                if(req.body['team'+i]!=undefined){
                    var separ = req.body['team'+i].split('(');
                    console.log(separ);
                    separ[1] = separ[1].slice(0, -1);
                    console.log(separ[1]);
                    for(var j=0; j< allstaffs.length; j++){
                        if(separ[0]==allstaffs[j].name && separ[1]==allstaffs[j].department){
                            team.push(allstaffs[j]);
                            break;
                        }
                    }
                }
            }
            console.log(team);

            for(var l=0; l< Object.keys(req.body).length; l++){
                if(req.body['dept'+l]!=undefined){
                    for(var y=0; y<allstaffs.length; y++){
                        if(allstaffs[y].department==req.body['dept'+l]){
                            team.push(allstaffs[y]);
                        }
                    }
                }
            }
            console.log(team);
            AddProject.team = team;
            AddProject.description = req.body.description;

            AddProject.save((err)=>{
                if(err) console.log(err);
                else{
                    AddLog = new activities();
                    AddLog.DateCreated = new Date().toDateString();
                    AddLog.Text = req.user.name+" created project: "+AddProject.title;
                    AddLog.Company = req.user.company;
                    AddLog.ViewType = 3;

                    AddLog.save((err)=>{
                        if(err) console.log(err);
                        else res.redirect('/hr/projects');
                    })
                }
            })


        })
    }

});

router.get('/terminate-project/:projectID', (req, res)=>{
    projects.findByIdAndUpdate(req.params.projectID, { $set:{shutdown: true}}, (err, updated)=>{
        if(err) console.log(err);
        else{
            console.log(updated);
            res.redirect('/admin/projects');
        }
    })
})


router.get('/payroll-system', (req, res)=>{
    notifications.find({company: req.user.company}, (err, allnotifications)=>{
        var counter = 0;
        for(var d=0; d<allnotifications.length; d++){
            if(allnotifications[d].Read==false)counter++;
        }
        employees.findOne({email: req.user.email}, (err, hrstaff)=>{
            res.render('viewpayroll',{
                user: req.user,
                notifications: allnotifications,
                unreadCount: counter,
                employee: hrstaff
            });
        })


    })
})

router.get('/basic-salary', (req, res)=>{
    employees.findOne({username: req.user.username}, (err, employee)=>{
        notifications.find({company: req.user.company}, (err, allnotifications)=>{
            var counter = 0;
            for(var d=0; d<allnotifications.length; d++){
                if(allnotifications[d].Read==false)counter++;
            }
            salaries.find({company: req.user.company}, (err, salaryInfo)=>{
                res.render('basicsalary',{
                    salaries: salaryInfo,
                    notifications: allnotifications,
                    user: req.user,
                    unreadCount: counter,
                    employee: employee
                });
            })
        })
    })

});

router.get('/setup-payroll', (req, res)=>{
    notifications.find({company: req.user.company}, (err, allnotifications)=>{
        var counter = 0;
        var levels = [];
        var employee = {};
        for(var d=0; d<allnotifications.length; d++){
            if(allnotifications[d].Read==false)counter++;
        }
        employees.find({company: req.user.company}, (err, employees)=>{
            for(var b=0; b<employees.length; b++){
                if(!(levels.includes(employees[b].level))){
                    levels.push(employees[b].level);
                }
            }
            for(var c=0; c< employees.length; c++){
                if(employees[c].username == req.user.username){
                    employee = employees[c];
                    break;
                }
            }

            res.render('createroll',{
                user: req.user,
                unreadCount: counter,
                levels: levels,
                notifications: allnotifications,
                employee: employee
            });
        })
    
})

});

router.post('/create-payroll', (req, res)=>{
    employees.findOne({username: req.user.username}, (err, hrstaff)=>{
        console.log(req.body);
        AddSalary = new salaries();
        AddSalary.company = req.user.company;
        AddSalary.EmployeeType = req.body.level;
        var push = {};
        push['Basic'] = req.body[Object.keys(req.body)[1]];
        for(var x=2; x<(Object.keys(req.body).length)-1; x+=2){
            push[req.body[Object.keys(req.body)[x]]] = req.body[Object.keys(req.body)[x+1]];
        }
        console.log(push);
        AddSalary.Allowances = push;

        AddSalary.save((err)=>{
            if(err) console.log(err);
            else{
                AddLog = new activities();
                AddLog.DateCreated = new Date().toUTCString();
                AddLog.Text = "Payroll for Level"+req.body.level+" was created by "+req.user.name+"("+req.user.username+") on "+AddLog.DateCreated;
                AddLog.Company = req.user.company;
                AddLog.Department = hrstaff.department;
                AddLog.ViewType = 71;

                AddLog.save((err)=>{
                    if(err) console.log(err);
                    else{
                        res.redirect('/hr/basic-salary');
                    }
                })
                
            }
        })
    })
    
});

router.get('/level:level', (req, res)=>{
    salaries.find({company: req.user.company, EmployeeType: req.params.level}, (err, payrolLvl)=>{
        if(err) console.log(err);
        else{
            notifications.find({company: req.user.company}, (err, allnotifications)=>{
                var counter = 0;
                for(var d=0; d<allnotifications.length; d++){
                    if(allnotifications[d].Read==false)counter++;
                }
                employees.find({username: req.user.username, company: req.user.company}, (err, employee)=>{
                    employees.find({company: req.user.company, level: req.params.level}, (err, allemployees)=>{
                        console.log(allemployees);
                        res.render('editpay',{
                            user: req.user,
                            notifications: allnotifications,
                            fpayroll: payrolLvl,
                            employee: employee,
                            numRead: counter,
                            employees: allemployees
                        })
                    })
                })

            })

        }
    })
});

router.get('/edit-pay:employeeID',(req, res)=>{
    if(req.isAuthenticated() && req.user.user_type==2){
        employees.findOne({username: req.user.username}, (err, hrstaff)=>{
            employees.findById(req.params.employeeID, (err, employee)=>{
                salaries.find({company: req.user.company, EmployeeType: employee.level}, (err, payrolLvl)=>{
                    if(err) console.log(err);
                    else{
                        if(payrolLvl.length>1){
                            for(var z=0; z< payrolLvl.length; z++){
                                if(payrolLvl[z].EmployeeName == employee.username){
                                    payrolLvl[0] = payrolLvl[z];
                                    break;
                                }
                            }
                        }
                        notifications.find({company: req.user.company}, (err, allnotifications)=>{
                            var counter = 0;
                            for(var d=0; d<allnotifications.length; d++){
                                if(allnotifications[d].Read==false)counter++;
                            }
                            console.log(payrolLvl[0]);

                            res.render('staffpay',{
                                employee: hrstaff,
                                staff: employee,
                                notifications: allnotifications,
                                counter: counter,
                                payroll: payrolLvl[0],
                                user: req.user
                            })
                        })
                    }
                })
            })
        })
    }
})

router.post('/save-payroll/:payrollID', (req, res)=>{
    console.log(req.body);
    employees.findOne({username: req.user.username}, (err, hrstaff)=>{
        salaries.findById(req.params.payrollID, (err, value)=>{
            var salarieObj = {};
            for(var h=0; h<Object.keys(req.body).length; h++){
                if(Object.keys(req.body)[h].includes("allowance")){
                    salarieObj[req.body[Object.keys(req.body)[h]]] = req.body[Object.keys(req.body)[h+1]];
                }
                else if(Object.keys(req.body)[h].includes("deduction")){
                    
                    console.log(req.body[Object.keys(req.body)[h]]);
                    salarieObj[req.body[Object.keys(req.body)[h]]] = "-"+req.body[Object.keys(req.body)[h+1]];
                }
                else if(!(Object.keys(req.body)[h].includes("allowance")) && !(Object.keys(req.body)[h].includes("amount")) && req.body[Object.keys(req.body)[h]]!=''){
                    salarieObj[Object.keys(req.body)[h]] = req.body[Object.keys(req.body)[h]];
                }
                
            }
            for(var c=0; c< Object.keys(salarieObj).length; c++){
                value.Allowances[Object.keys(salarieObj)[c]] = salarieObj[Object.keys(salarieObj)[c]];
            }

            salaries.findByIdAndUpdate(req.params.payrollID, {$set: {Allowances: value.Allowances}}, {useFindAndModify: false}, (err, result)=>{
                AddLog = new activities();
                AddLog.DateCreated = new Date().toUTCString();
                AddLog.Text = "Payroll for Level "+value.EmployeeType+" was modified by "+req.user.name+"("+req.user.username+") on "+AddLog.DateCreated;
                AddLog.Company = req.user.company;
                AddLog.Department = hrstaff.department;
                AddLog.ViewType = value.EmployeeType;

                AddLog.save((err)=>{
                    if(err) console.log(err);
                    else{
                        req.flash("success", "Payroll has been successfully modified");
                        res.redirect('/hr/basic-salary');
                    }
                })
            })
        })
    })
        
})

router.get('/viewleave', (req, res)=>{
    employees.findOne({username: req.user.username}, (err, hrstaff)=>{
        if(err) console.log(err);
        else{
            leaverequests.find({company:req.user.company}, (err, allrequests)=>{
                notifications.find({company: req.user.company}, (err, allnotifications)=>{
                    var counter = 0;
                    for(var d=0; d<allnotifications.length; d++){
                        if(allnotifications[d].Read==false)counter++;
                    }

                    res.render('leaverequests',{
                        user: req.user,
                        notifications: allnotifications,
                        staffs: hrstaff,
                        leaverequests: allrequests,
                        numRead: counter
                    })
                })
            })
        }
    })
})

router.get('/:leaveID/accept', (req, res)=>{
    leaverequests.findByIdAndUpdate(req.params.leaveID, {$set:{Approval: 2}}, {useFindAndModify: false}, (err, leaverequest)=>{
        if(err) console.log(err);
        else{
            req.flash("success", "Leave Approved");
            res.redirect('/hr/viewleave');
        }
    })
})

router.get('/:leaveID/reject', (req, res)=>{
    leaverequests.findByIdAndUpdate(req.params.leaveID, {$set: {Approval: -1}}, {useFindAndModify: false}, (err, leaverequest)=>{
        if(err) console.log(err);
        else{
            req.flash("danger", "Leave Declined");
            res.redirect('/hr/viewleave');
        }
    })
});

router.get('/assignHOD/:employeeID', (req, res)=>{
    employees.findById(req.params.employeeID, (err, employee)=>{
        departments.findOne({company: req.user.company, name: employee.department},(err, department)=>{
        users.update({username: employee.username, company: req.user.company}, {$set: {user_type: 3}}, (err, user_update)=>{
            console.log(user_update);
        })
        AddLog = new activities();
        AddLog.DateCreated = new Date().toDateString();
        AddLog.Text = employee.name+"("+employee.username+") has been assigned as the Head of "+employee.department+" Department";
        AddLog.Company = employee.company;
        AddLog.Department = employee.department;
        AddLog.ViewType = 1;

        AddLog.save((err)=>{
            if(err) console.log(err);
            else{
                req.flash("success","Successful");
                res.redirect('/hr/viewdept'+department.id);
            }
        })
        })
    })
});

router.post('/send_message', (req, res)=>{
    console.log(req.body.staff_id);
    console.log(req.body.messager);
    companies.findOne({username: req.user.company}, (err, company)=>{
        employees.findOne({username: req.user.username}, (err, hremployee)=>{
            employees.findById(req.body.staff_id, (err, employee)=>{
                AddMessage = new messages();
                AddMessage.DateCreated = new Date();
                AddMessage.company = req.user.company;
                AddMessage.Sender = hremployee;
                AddMessage.Receiver = employee;
                AddMessage.Read = false;
                AddMessage.save((err)=>{
                    if(err) console.log(err);
                    else{
                        AddLog = new activities();
                        AddLog.DateCreated = new Date();
                        AddLog.Text = req.user.name+" sent a message to "+employee.name+"("+employee.department+")";
                        AddLog.Company = req.user.company;
                        AddLog.ViewType = 3;

                        AddLog.save((err)=>{
                            if(err) console.log(err);
                            else{
                                res.redirect('/hr/staffs');
                            }
                        })
                    }
                })
            })

        })
    })


})

module.exports = router;