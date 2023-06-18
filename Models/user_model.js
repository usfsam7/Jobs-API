const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "username required"],
      minLength: [3, "Username Length Must be at least 3"],
      maxLength: [20, "Username Length Must be 10 Or Less"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "user email required"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Provide a valid email",
      ],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "user password required"],
      minLength: [5, "Password Length Must be at least 5"],
    },
  },
  { versionKey: false }
);
    

  const User = mongoose.model('User', userSchema)
  module.exports = User