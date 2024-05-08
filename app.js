'use strict';

require('dotenv').config();
const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const app = express();

const { PORT, KEY_SESSION } = process.env;
//express > 4.16
app.use(express.json());
app.use(express.urlencoded({
    extended:true
}));

const store = session.MemoryStore(); // save session in memory
app.use(session({
    saveUninitialized: false,
    secret: KEY_SESSION,
    cookie: {
        maxAge: 1000 * 20
    },
    store
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/status', ( req, res, next ) => {
    res.json({
        result: 'success',
        message: "Welcome to the status page!"
    })
});

app.get('/profile', ( req, res ) => {
    if(req.isAuthenticated()){
        return res.json({
            result: 'success',
            data: {
                name: "thanh quang",
                age: 20,
                active: true
            },
            message: "Welcome to the profile page!"
        })
    }
    res.json({
        result: 'falied',
        message: "Welcome to failed!"
    })
});

app.post('/login', 
    passport.authenticate('local', { 
        successRedirect: '/profile',
        failureRedirect: '/login' 
    }), (req, res) => {
    try {
        // const { email, password } = req.body;
        res.json({
            result: 'success',
            body: req.body
        });   
    } catch (error) {
        console.error(error);
    }
});

const user = {
    username: "Hieungu",
    password: "123456"
}
passport.use( new LocalStrategy( ( username, password, done ) => {
    console.log(`username::: ${username} password:::${password}`);
    if(username === user.username && password === user.password) {
        return done(null, {
            username,
            password,
            active: true
        });
    }
    done(null, false);
}));

passport.serializeUser( ( user, done ) => done( null, user.username ));
passport.deserializeUser( (username, done) => {
    console.log(`deserializeUser::: ${username} `);
    if( username === user.username ){
        return done( null, {
            username,
            active: true
        })
    }
    done(null, false);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT || 5000}`);
})

