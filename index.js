const express = require('express');
const session = require('express-session');

const app = express();
app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'pug');

const Database = require('./db');
const db = new Database();
db.initialize();

app.use((req, res, next) => {
    req.db = db;
    next(); 
})

app.use(session({
    secret: 'proj2cmps369',
    resave: 'false',
    saveUninitialized: true,
    cookie: {secure: false}
}))

app.use((req, res, next) => {
    if(req.session.user){
        res.locals.user = {
            id: req.session.user.id,
            first_name: req.session.user.first_name,
            last_name: req.session.user.last_name,
            username: req.session.user.username
        }
    }
    next();
})

app.use('/', require('./routes/accounts'))
app.use('/', require('./routes/contacts'))

app.listen(3000, () => {
    console.log(`app listening on port 3000`)
})
