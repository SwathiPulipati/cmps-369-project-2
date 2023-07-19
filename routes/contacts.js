const express = require('express')
const router = express.Router();

const logged_in = (req, res, next) => {
    if(req.session.user){
        next();
    }
    else{
        res.status(401).send('Not authorized');
    }
}

const first_open =  async (req, res, next) => {
    const user = await req.db.findUserByUsername('cmps369');
    if(!user)
        await req.db.addDefaultData();
    next();
}

router.get('/', first_open, async (req, res) => {
    const contacts = await req.db.findContacts();
    res.render('home', {contacts: contacts});
})

router.get('/create', async (req, res) => {
    res.render('create');
})

router.post('/create', async (req, res) => {
    console.log(req.body);
    for (let prop in req.body){
        if(req.body[prop].trim() === ''){
            res.render('create', {message: '*** Please submit all requested contact information ***'})
            return;
        }
    }
    const id = await req.db.createContact(req.body)
    res.redirect('/')
})

router.get('/:id', async (req, res) => {
    if (!isNaN(req.params.id)){
        const contact = await req.db.findSingleContact(req.params.id);
        res.render('info', {c: contact}); 
    }
})

router.get('/:id/edit', logged_in, async (req, res) => {
    if (!isNaN(req.params.id)){
        const contact = await req.db.findSingleContact(req.params.id);
        res.render('edit', {c: contact}); 
    }
})

router.post('/:id/edit', async (req, res) => {
    console.log(req.body);
    await req.db.editContact(req.params.id, req.body);
    res.redirect('/'+req.params.id); 
})

router.get('/:id/delete', logged_in, async (req, res) => {
    const contact = await req.db.findSingleContact(req.params.id);
    res.render('delete', {c: contact});
})

router.post('/:id/delete', async (req, res) => {
    await req.db.deleteContact(req.params.id);
    res.redirect('/')
})



module.exports = router;
