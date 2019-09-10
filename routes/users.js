const express = require('express');
const router = express.Router();
const users = require('../models/user');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const companies = require('../models/company');
const multer = require('multer');
const path = require('path');

let CompanyLogoStorage = multer.diskStorage({
    destination: './assets/img/company-logos',
    filename: (req, file, callback) =>{
        callback(null, file.fieldname+'_'+Date.now()+path.extname(file.originalname));
    }
})
let logoUpload = multer({
    storage: CompanyLogoStorage
});

router.get('/register', (req, res)=>{
    res.render('register');
});

router.get('/login', (req, res)=>{
    res.render('login');
});

router.post('/register-org', logoUpload.single('company_logo'), (req, res)=>{
    users.find({}, (err, allusers)=>{
        AddCompany = new companies();
        AddCompany.name = req.body.comp_name;
        AddCompany.email = req.body.email;
        AddCompany.username = "USER0"+(Math.floor(Math.random() * (99999 - 11111) + 11111).toString());
        if(allusers.length>0){
            for(var k=0; k< allusers.length; k++){
                if(allusers[0].username == AddCompany.username){
                    AddCompany.username = "USER0"+(Math.floor(Math.random() * (99999 - 11111) + 11111).toString());
                }
            }
        }else AddCompany.username = "USER0"+(Math.floor(Math.random() * (99999 - 11111) + 11111).toString());
        AddCompany.mobile_no = req.body.mobile;
        AddCompany.address = req.body.address;
        AddCompany.type = req.body.business_type;
        AddCompany.company_logo = req.file.path.replace('assets\\img\\company-logos\\','assets/img/company-logos/');
        AddCompany.save((err)=>{
            AddUser = new users();
            AddUser.name = req.body.comp_name;
            AddUser.email = req.body.email;
            AddUser.username = AddCompany.username;
            AddUser.company = AddUser.username;
            AddUser.user_type = 0;
            bcrypt.genSalt(10, (err, salt)=>{
                bcrypt.hash(req.body.password, salt, (err, hash)=>{
                    if(err) console.log(err);
                    else AddUser.password = hash;

                    AddUser.save((err)=>{
                        if(err) console.log(err);
                        else{
                            req.flash("success", "You have successfully registered!");
                            res.render('login');
                        }
                    });
                });
            });
        });
    });
});

router.post('/login', (req, res, next)=>{
    users.find({$or: [{username:req.body.username}, {email: req.body.username}]}, function(err, checker){
        console.log(checker);
        if(checker.length>0){
                    if(checker[0].user_type==0){
                    console.log("checking");
                    passport.authenticate('local', {
                        successRedirect: '/admin/dashboard',
                        failureRedirect: '/user/login',
                        failureFlash: true
                    })(req, res, next);
                }
            else if(checker[0].user_type==1){
                passport.authenticate('local', {
                    successRedirect: '/employee/dashboard',
                    failureRedirect: '/user/login',
                    failureFlash: true
                })(req, res, next);
            }
            else if(checker[0].user_type==2){
                passport.authenticate('local', {
                    successRedirect: '/hr/dashboard',
                    failureRedirect: '/user/login',
                    failureFlash: true
                })(req, res, next);
            }
            else if(checker[0].user_type==3){
                passport.authenticate('local', {
                    successRedirect: '/employee/dashboard',
                    failureRedirect: '/user/login',
                    failureFlash: true
                })(req, res, next);
            }
        }
        else{
            passport.authenticate('local', {
                successRedirect: '/',
                failureRedirect: '/user/login',
                failureFlash: true
            })(req, res, next);
        }
    });
});

module.exports = router;