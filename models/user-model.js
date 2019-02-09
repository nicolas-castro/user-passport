const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: String, 
  password: String,
  fullName: String,
  slackId: String,
  googleId : String
}, {
  timestamps: true
})

// const User = mongoose.model('User', userSchema);
// module.exports = User;

module.exports = mongoose.model('User', userSchema);