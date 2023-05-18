const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: [ 3, 'Username Length Must be at least 3' ],
        maxLength: [ 20, 'Username Length Must be 10 Or Less' ],
    },
    password: {
        type: String,
        required: true,
        minLength: [ 5, 'Password Length Must be at least 5' ],
    }
  }, { versionKey: false });
    

  const User = mongoose.model('User', userSchema)
  module.exports = User