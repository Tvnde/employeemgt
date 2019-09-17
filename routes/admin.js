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
    if(req.user!=undefined && req.user.user_type==0){
        notifications.find({company: req.user.username}, (err, allnotifications)=>{
            companies.findOne({username: req.user.username}, (err, company)=>{
                activities.find({Company: company.username}, (err, activitylogs)=>{
                    var noRead = 0;
                    for(var i=0; i< allnotifications.length; i++){
                        if(allnotifications.Read==false) noRead++;
                    }
                    res.render('adminhome',{
                        user: req.user,
                        notifications: allnotifications,
                        activelogs: activitylogs,
                        numRead: noRead,
                        company: company
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
    notifications.find({company: req.user.username}, (err, allnotifications)=>{
        employees.find({company: req.user.username}, (err, employees)=>{
            companies.findOne({username: req.user.username},(err, company)=>{
                var counter = 0;
                for(var d=0; d<allnotifications.length; d++){
                    if(allnotifications[d].Read==false)counter++;
                }
                res.render('viewstaffs',{
                    employees: employees,
                    user: req.user,
                    notifications: allnotifications,
                    counter: counter,
                    company: company
                })
            })
        })
    })

});

router.get('/departments', (req, res)=>{
    departments.find({company: req.user.username}, (err, alldepts)=>{
        notifications.find({company: req.user.username}, (err, allnotifications)=>{
            companies.findOne({username:req.user.username},(err, company)=>{
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
                    company: company
                });
            });
        })
    })
});

router.get('/viewdept:deptID', (req, res)=>{
    companies.findOne({username: req.user.username}, (err, company)=>{
        var holder = [];
    var employee;
    var hod;
    departments.findById(req.params.deptID, (err, department)=>{
        users.find({user_type: 3},(err, allhods)=>{
            console.log(allhods);
        employees.find({company: req.user.username}, (err, allemployees)=>{
            for(var s=0; s< allemployees.length; s++){
                if(allemployees[s].department == department.name){
                    holder.push(allemployees[s]);
                }
                if(allemployees[s].username == req.user.username) employee = allemployees[s];
            }
            console.log(holder);
            if(allhods.length>0){
                for(var n=0; n< allhods.length; n++){
                    for(var t=0; t<holder.length; t++){
                        if(allhods[n].username == holder[t].username){
                            console.log("true");
                            hod = holder[t];
                            break;
                        }
                    }
                    if(hod!=undefined) break;
                }
        } else hod = {};
            notifications.find({company: req.user.username}, (err, allnotifications)=>{
                var counter = 0;
                for(var d=0; d<allnotifications.length; d++){
                    if(allnotifications[d].Read==false)counter++;
                }
                console.log(company);
                console.log(hod);
                res.render('deptdetails',{
                    user: req.user,
                    employees: holder,
                    department: department,
                    company: company,
                    counter: counter,
                    notifications: allnotifications,
                    hod: hod
                })
            })
        })
        })
    })
    })
})

router.get('/addstaff', (req, res)=>{
    companies.findOne({username: req.user.username}, (err, company)=>{
        notifications.find({company: req.user.username}, (err, allnotifications)=>{
            var counter = 0;
            for(var d=0; d<allnotifications.length; d++){
                if(allnotifications[d].Read==false)counter++;
            }
            console.log(counter);
            departments.find({company: req.user.username}, (err, alldepts)=>{
                res.render('addemployee',{
                    user: req.user,
                    departments: alldepts,
                    notifications: allnotifications,
                    counter: counter,
                    employee: company
                })    
            })
        })
    })
});

router.post('/addstaff', Employeeupload.single('profilephoto'),  (req, res)=>{
    console.log(req.body);
    users.find({}, (err, allusers)=>{
    AddEmployee = new employees();
    AddEmployee.name = req.body.f_name+" "+req.body.l_name;
    AddEmployee.email = req.body.email;
    AddEmployee.company = req.user.username;
    AddEmployee.gender = req.body.gender;
    if(allusers.length>0){
        AddEmployee.username = "USER0"+(Math.floor(Math.random() * (99999 - 11111) + 11111).toString());
        for(var k=0; k< allusers.length; k++){
            if(allusers[k].username == AddEmployee.username){
                AddEmployee.username = "USER0"+(Math.floor(Math.random() * (99999 - 11111) + 11111).toString());
            }
        }
    }else AddEmployee.username = "USER0"+(Math.floor(Math.random() * (99999 - 11111) + 11111).toString());
    console.log("Passed");
    AddEmployee.level = 01;
    AddEmployee.dateofbirth = req.body.dob;
    if(req.body.department!=undefined) AddEmployee.department = req.body.department;
    AddEmployee.mobile_no = req.body.mobile;
    AddEmployee.profilephoto = req.file.path.replace('assets\\img\\staff\\','../assets/img/staff/');
    AddEmployee.save((err)=>{
        if(err) console.log(err);
        else{
            if(req.body.department!=undefined){
                departments.find({name: req.body.department, company: req.user.username}, (err, thedept)=>{
                    var members = thedept[0].members;
                    members.push(AddEmployee);
                    departments.updateOne({name: req.body.department, company: req.user.username}, { $set: {members: members}}, (err, updated)=>{
                        console.log(updated);
                   
            AddUser = new users();
            AddUser.name = AddEmployee.name;
            AddUser.username = AddEmployee.username;
            AddUser.email = AddEmployee.email;
            AddUser.company = req.user.username;
            if(req.body.department!=undefined){
                console.log(thedept);
                if(thedept[0].type == "Human Resources"){
                    AddUser.user_type=2;
                }
                else if(thedept[0].type=="Admin"){
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
                            AddLog.Company = req.user.username;
                            AddLog.ViewType = 1;
                            AddLog.save((err)=>{
                                if(err) console.log(err);
                                else{
                                    req.flash("success", "Staff has been added!");
                                    res.redirect('/admin/staffs');
                                }
                            })
                        }
                    });
                });
            });
        })
    })
}else res.redirect("/unauthorized");
        };
    });
});
});

router.get('/addstaff:deptID', (req, res)=>{
    if(req.isAuthenticated() && req.user.user_type==0){
        companies.findOne({username: req.user.username}, (err, company)=>{
            console.log(company);
            console.log(req.user.username);
            departments.find({_id: req.params.deptID}, (err, department)=>{
                console.log(department);
                notifications.find({company: req.user.username}, (err, allnotifications)=>{
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
                        employee: company
                    })


                })
            })
        })
    }
})

router.get('/adddepts', (req, res)=>{
    if(req.isAuthenticated() && req.user.user_type==0){
        companies.findOne({username: req.user.username},(err, company)=>{
            notifications.find({company: req.user.username}, (err, allnotifications)=>{
                var checker = 0;
                for(var t=0; t<allnotifications.length; t++){
                    if(allnotifications[t].Read == false)checker++;
                }
                employees.find({company: req.user.username}, (err, allstaffs)=>{
                    res.render('adddepartments',{
                        user: req.user,
                        staffs: allstaffs,
                        notifications: allnotifications,
                        counter: checker,
                        company: company
                    });
                });

            });
        });
    }
});

router.post('/adddepts', (req, res)=>{
    employees.find({company:req.user.username}, (err, allstaffs)=>{
        if(err) console.log(err);
        else{
            AddDepartment = new departments();
            AddDepartment.name = req.body.dept_name;
            AddDepartment.type= req.body.dept_type;
            AddDepartment.description = req.body.description;
            var members=[];
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
            AddDepartment.company = req.user.username;
            AddDepartment.save((err)=>{
                if(err) console.log(err);
                else{
                    AddLog = new activities();
                    AddLog.DateCreated = new Date();
                    AddLog.Text = req.user.name+" created the Department "+AddDepartment.name;
                    AddLog.Company = req.user.username;
                    AddLog.ViewType = 1;
                    AddLog.save((err)=>{
                        if(err) console.log(err);
                        else{
                            res.redirect('/admin/departments');
                        }
                    })
                }
            })
        }
    })
});

router.get('/projects', (req, res)=>{
    if(req.isAuthenticated() && req.user.user_type==0){
        companies.findOne({username: req.user.username}, (err, company)=>{
            projects.find({company: req.user.username}, (err, allprojects)=>{
                notifications.find({company: req.user.username}, (err, allnotifications)=>{
                    var counter = 0;
                    for(var d=0; d<allnotifications.length; d++){
                        if(allnotifications[d].Read==false)counter++;
                    }
                    res.render('viewprojects',{
                        projects: allprojects,
                        user: req.user,
                        notifications: allnotifications,
                        company: company,
                        counter: counter
                    });
                })
            })
        })
    }else res.redirect('/unauthorized');
})

router.get('/createproject', (req, res)=>{
    departments.find({company: req.user.username},(err, alldepts)=>{
        notifications.find({company: req.user.username}, (err, allnotifications)=>{
            console.log(alldepts);
            var counter = 0;
                    for(var d=0; d<allnotifications.length; d++){
                        if(allnotifications[d].Read==false)counter++;
                    }
            employees.find({company: req.user.username}, (err, allstaffs)=>{
                console.log(allstaffs);
                res.render('createproject',{
                    user: req.user,
                    departments: alldepts,
                    employees: allstaffs,
                    notifications: allnotifications,
                    counter: counter
                })
            })
        })
        
    })
});

router.post('/createproject', (req, res)=>{
    employees.find({company: req.user.username}, (err, allstaffs)=>{
        AddProject = new projects();
        AddProject.title = req.body.proj_title;
        AddProject.deadline = req.body.proj_duration;
        AddProject.company = req.user.username;
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
                AddLog.DateCreated = new Date().toDateString();
                AddLog.Text = req.user.name+" created project "+AddProject.title;
                AddLog.Company = req.user.username;
                AddLog.ViewType = 3;

                AddLog.save((err)=>{
                    if(err) console.log(err);
                    else res.redirect('/admin/projects');
                })
            }
        })


    })

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

router.get('/viewleavereq/:NotificationID', (req, res)=>{
    console.log(req.params.NotificationID);
    var details = {};
    notifications.find({company: req.user.username, TypeID: 3}, (err, allnotifications)=>{
        for(var i=0;i < allnotifications.length; i++){
            console.log(allnotifications[i].id);

            if(allnotifications[i].id.toString()==req.params.NotificationID.toString()){
                details = allnotifications[i];
                console.log("Leave request for this person "+details);
                break;
            }
        }
        notifications.findByIdAndUpdate(req.params.NotificationID,{$set: {Read: true}},(err, updated)=>{
            leaverequests.find({RequestedBy: details.Sender}, (err, therequest)=>{
                console.log(updated);
                var pp = details.Sender.profilephoto.replace('../','/');
                console.log(therequest);
                res.render('viewleave',{
                    details: details,
                    notifications: allnotifications,
                    user: req.user,
                    profilephoto: pp,
                    request: therequest
                });
            })
        })
           
    })
});

router.get('/accept/:requestID', (req, res)=>{
    leaverequests.findByIdAndUpdate(req.params.requestID, {$set: {Approval: 2}}, (err, therequest)=>{
        if(err) console.log(err);
        console.log(therequest);
        req.flash('A notification for approval has been sent to the Admin.');
        res.redirect('/admin/dashboard');
    });
});

router.get('/reject/:requestID', (req, res)=>{
    leaverequests.findByIdAndUpdate(req.params.requestID, {$set: {Approval: -1}}, (err, requestupdate)=>{
         if(err) console.log(err);
         else{
             companies.findOne({username: req.user.username}, (err, company)=>{
                AddNotification = new notifications();
                AddNotification.DateCreated = new Date();
                AddNotification.NotificationType = "Leave Reject";
                AddNotification.TypeID = 4;
                AddNotification.company = req.user.username;
                AddNotification.Sender = company[0];
                AddNotification.Read = false;

                AddNotification.save((err)=>{
                    if(err) console.log(err);
                    else{
                        console.log(requestupdate);
                        req.flash('Rejected');
                        res.redirect('/admin/dashboard');
                    }
                })

             })

            
         }
    })
});

router.post('/send_message', (req, res)=>{
    console.log(req.body.staff_id);
    console.log(req.body.messager);
    companies.find({username: req.user.username}, (err, company)=>{
        employees.findById(req.body.staff_id, (err, employee)=>{
            AddMessage = new messages();
            AddMessage.DateCreated = new Date();
            AddMessage.company = req.user.username;
            AddMessage.Sender = company[0];
            AddMessage.Receiver = employee;
            AddMessage.Read = false;

            AddMessage.save((err)=>{
                if(err) console.log(err);
                else{
                    AddLog = new activities();
                    AddLog.DateCreated = new Date();
                    AddLog.Text = req.user.name+" sent a message to "+employee.name+"("+employee.department+")";
                    AddLog.Company = req.user.username;
                    AddLog.ViewType = 3;

                    AddLog.save((err)=>{
                        if(err) console.log(err);
                        else{
                            res.redirect('/admin/staffs');
                        }
                    })
                }
            })
        })

        
    })


})

module.exports = router;