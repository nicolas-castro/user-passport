const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/user-model');


// serializeUser => what to be saved in the session
//                            cb stands for call back
passport.serializeUser((user, cb) => {
  //null means no errors
  cb(null, user._id);// save user id into session
})



// retreiving user data from DB 
// this fucntion get call everytime we request for a user everytime when we need req.user
passport.deserializeUser((userId, cb)=>{
    User.findById(userId)
    .then(user => {
      cb(null, user);
    })
    .catch( err => cb(err));
})

passport.use(new LocalStrategy({
  usernameField: 'email' // <== this step we take because we don't use username but email to register and login users
  // if we use username we don't have to put this object:{ usernameField: 'email }
},(email, password, next) => {
  User.findOne({ email })
  .then(userFromDb => {
    if(!userFromDb){
      return next(null, false, { message: 'Incorrect email!' })
    }
    if(!bcrypt.compareSync(password, userFromDb.password)){
      return next(null, false, { message: 'Incorrect password!' })
    }
    return next(null, userFromDb)
  })
  .catch( err => next(err))
}))


