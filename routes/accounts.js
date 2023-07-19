const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs')

router.get('/login', async (req, res) => {
    res.render('login', {hide_login: true});
})

router.post('/login', async (req, res) => {
    const un = req.body.username.trim();
    const pw = req.body.password.trim();

    const user = await req.db.findUserByUsername(un);
    if( user && bcrypt.compareSync(pw, user.password)){
        req.session.user = user;
        res.redirect('/');
        return;
    } else {
        res.render('login', {hide_login: true, message: "Sorry, couldn't sign you in..."});
        return;
    }
})

router.get('/signup', async (req, res) => {
    res.render('signup', {hide_login: true});
})

router.post('/signup', async (req, res) => {
    const first = req.body.first.trim();
    const last = req.body.last.trim();
    const us = req.body.username.trim();
    const p1 = req.body.password.trim();
    const p2 = req.body.password2.trim();

    for (let prop in req.body){
        if(req.body[prop].trim() === ''){
            res.render('signup', {hide_login: true, message: 'Please submit all requested user information'})
            return;
        }
    }

    if(p1 != p2){
        res.render('signup', {hide_login: true, message: 'Passwords do not match!'});
        return;
    }
    const user = await req.db.findUserByUsername(us);
    if(user){
        res.render('signup', {hide_login: true, message: 'This account already exists!'});
        return;
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(p1, salt);     // the salt is prepended to the hashed password

    const id = await req.db.createUser(first, last, us, hash);
    req.session.user = await req.db.findUserByUsername(us);
    res.redirect('/');
})

router.get('/logout', async (req, res) => {
    req.session.user = undefined;
    res.redirect('/');
})

module.exports = router;
