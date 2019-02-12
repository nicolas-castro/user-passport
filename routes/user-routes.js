const express = require('express');
const router = express.Router();

const Room = require('../models/room-model');
const User = require('../models/user-model');

router.get('/private', (req,res,next)=>{
  if(!req.user){
    req.flash('error', 'Please login');
    res.redirect('/login');
    return;
  }
  res.render('user-pages/profile-page')

})


router.get('/public', (req,res,next)=> {
  res.render('user-pages/public-page');
})

router.get('/public', (req, res, next) => {
  Room.find()
  .then( publicRooms => {
    res.render('user-pages/public-page', { publicRooms })
    console.log('Public Roooms: ', publicRooms)
    })
    .catch( err => next(err) )
})
    

module.exports = router;