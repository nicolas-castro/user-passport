const express = require('express');
const router = express.Router();
const User = require('../models/user-model')
const bcrypt = require('bcryptjs');
const bcryptSalt = 10;
const passport = require('passport');



router.get('/signup', (req, res, next)=> {
  res.render('auth/signup');
})

router.post('/register', (req, res, next)=> {

  const userEmail = req.body.email;
  const userPassword = req.body.password;
  const userFullName = req.body.fullName;

  if(userEmail == '' || userPassword == '' || userFullName == ''){
    req.flash('error', 'Please fill all the fields')
    res.render('auth/signup', )
    return;
  }
  
  User.findOne({ email: userEmail })
  .then(foundUser =>{
    if(foundUser !== null){
      // res.render('auth/signup', { errorMessage: 'Sorry, an account with that email already exists'});
      req.flash('error', 'Sorry that email already exits, please login');
      res.redirect('login');
      return;
    }
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPassword = bcrypt.hashSync(userPassword, salt);

    User.create({
      email: userEmail,
      password: hashPassword,
      fullName: userFullName,
    })
    .then(user => {
      // console.log("redirecting to another page", user)
      req.login(user, (err) => {
        if(err){
          req.flash('error', 'Auto login failed, please log in manually');
          res.redirect('/login');
          return;
        }
        res.redirect('/private');
      })
      
    })
    .catch( err => next(err)); //closign User.create

  })
  .catch( err => next(err)); // closing User.findOne

})

router.get('/login', (req,res,next)=>{
  res.render('auth/login');
})


router.post('/login', passport.authenticate ('local', {
  successRedirect: '/private',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true,
}))

//////////logout///////////

router.post('/logout', (req, res, next) => {
  req.logout(); // <== .logout() method comes from passport and takes care of the destroying the session for us
  res.redirect('/login');
})


//////////slack///////////

router.get('/slack-login', passport.authenticate('slack'));
router.get('/slack/callback', passport.authenticate('slack', {
  successReturnToOrRedirect:'/private',
  successFlash:'Slack login successful!',
  failureRedirect:'/login',
  failureMessage:'Slack login failed. Pease try to login manually. 🙏🏻'
}))

//////////google///////////

router.get('/google-login', passport.authenticate('google', {
  scope: [
    "https://www.googleapis.com/auth/plus.login",
    "https://www.googleapis.com/auth/plus.profile.emails.read"
  ]
}));

router.get('/google/callback', passport.authenticate('google', {
  successRedirect: '/private',
  failureRedirect: '/login',

}))


module.exports = router;