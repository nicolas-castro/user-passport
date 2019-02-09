const passport = require('passport');
const User = require('../../models/user-model');
const flash = require('connect-flash');

require('./local-strategy')
require('./slack-strategy')
require('./google-strategy')

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

function passportBasicSetup(blah){

  blah.use(passport.initialize());
  blah.use(passport.session());
  
  //activate flash messages. it is a function it need parenthesis flash()
  blah.use(flash());
  
  blah.use((req, res, next) =>{
    res.locals.messages = req.flash();
    if(req.user){
      res.locals.currentUser = req.user;
    }
    next();
  })

}

module.exports = passportBasicSetup;

