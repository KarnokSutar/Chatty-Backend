const express = require('express')
const Chat = require('../models/chat')
const User = require('../models/user')
const passport = require('passport');
const router = new express.Router()

router.post('/newchat', passport.authenticate('jwt', { session: false }), async function (req, res, next) {
    const newChat = new Chat({
        text: req.body.text,
        sendBy: req.body.from,
        users: [req.body.from, req.body.to]
    });

    const user = req.user;
    const index = user.friends.includes(req.body.to.toString())
console.log(index)
    if (!index) {
        User.findOneAndUpdate({ _id: req.body.from  }, { $push: { friends: req.body.to } }, function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log(success);
            }
        })
        User.findOneAndUpdate({ _id: req.body.to }, { $push: { friends: req.body.from } }, function (error, success) {
            if (error) {
                console.log(error);
            } else {
                console.log(success);
            }
        })
    }
    else{

        user.friends.splice(0, 0, user.friends.splice(index, 1)[0]);

    }
    try {

        await newChat.save();
        res.json({ chat: newChat })

    } catch (err) {
        console.log(err)
        res.status(401).json({ err })
    }

});

router.post('/getchat', passport.authenticate('jwt', { session: false }), async function (req, res, next) {

    try {
        const chat = await Chat.find({
            users: {
                $all: [req.body.from, req.body.to]
            }
        }).sort({ updatedAt: 1 })

        res.json({ chat: chat })
    } catch (error) {
        console.log(error)
        res.status(401).json(error)
    }


});

module.exports = router;