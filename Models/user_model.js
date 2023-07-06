const mongoose = require('mongoose')
const validator = require('validator')



const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username required"],
      minLength: [3, "Username Length Must be at least 3"],
      maxLength: [20, "Username Length Must be 10 Or Less"],
      lowercase: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "user email required"],
      unique: true,
      lowercase: true,
      // validate(value)  {
      //   if (!validator.isEmail(value)) throw new Error('email is invalid');
      //  }
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "user password required"],
      minLength: [5, "Password Length Must be at least 5"],
      lowercase: true,
    },
  },
  { versionKey: false }
);
    

  const User = mongoose.model('User', userSchema)
  module.exports = User