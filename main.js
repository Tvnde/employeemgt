const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config/database');
const passport = require('passport');
const session = require('express-session');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const cookieSession = require('cookie-session');

mongoose.connect(config.database, {useNewUrlParser: true});
let db = mongoose.connection;

db.on('error', function(err){
    console.log(err);
});

db.once('open', function(){
    console.log('Employee Database Opened');
})

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/assets', express.static('assets'));

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
  }));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

app.use(require('connect-flash')());
app.use((req, res, next)=>{
    res.locals.messages = require('express-messages')(req, res);
    next();
})

app.use(expressValidator({
    errorFormatter: (param, msg, value)=>{
        var namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root;

        while(namespace.length){
            formParam+= '[' + namespace.shift() + ']';
        }
        return{
            param: formParam,
            msg: msg,
            value: value
        }
    }
}))

require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.get('/',(req, res)=>{
    res.render('index');
});

app.get('/logout', function(req, res){
    req.logout();
    req.flash('success', 'You are logged out!');
    res.redirect('/user/login');
});


app.use('/user', require('./routes/users'));
app.use('/employee', require('./routes/employees'));
app.use('/admin', require('./routes/admin'));
app.use('/hr', require('./routes/humanres'));

app.listen(process.env.PORT || 5500, ()=>{
    console.log("Employee Management Server running...")
});