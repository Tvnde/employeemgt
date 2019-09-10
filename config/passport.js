const LocalStrategy = require('passport-local').Strategy;
const users = require('../models/user');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = function(passport){
    passport.use(new LocalStrategy(function(username, password, done){

        let query = {username: username};
        let query2 = {email: username};
        console.log("Using");
        console.log(username);
        users.findOne({ $or:[query, query2]}, function(err, user){
            if(err) throw err;
            if(!user){
                return done(null, false, {message: 'No user found'});
            }
            console.log(user);

            bcrypt.compare(password, user.password, function(err, isMatch){
                if(err) throw err;
                if(isMatch){
                    return done(null, user);
                }
                else{
                    return done(null, false, {message: 'Wrong password'});
                }
            });
        });
    }));

    passport.serializeUser(function(user, done){
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done){
        users.findById(id, function(err, user){
            done(err, user);
        });
    });
}
