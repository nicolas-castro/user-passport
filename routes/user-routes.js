const express = require('express');
const router = express.Router();

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

module.exports = router;