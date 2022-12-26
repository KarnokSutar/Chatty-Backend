const express = require('express')
const User = require('../models/user')
const router = new express.Router()
const passport = require('passport');



 router.get('/allusers',passport.authenticate('jwt', { session: false }), async function(req, res, next){
    const user = req.user
    let users = await User.find();
    users = users.map(u=>(
        {
            _id: u._id,
            name:u.name
        }))
console.log(users)
        users = users.filter(function(item) {
            return item._id.toString() !== 
            user._id.toString()
        })

        res.json({users: users})

 });
 router.get('/user',passport.authenticate('jwt', { session: false }), async function(req, res, next){
    const user = await req.user.populate(
        {
        path: 'friends',
        model: 'User',
        select:' name _id'
        }
    )
    console.log(user)
        res.json({user: user})

 });

 module.exports = router;