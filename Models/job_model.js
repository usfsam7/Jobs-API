const mongoose = require('mongoose')


 const jobSchema = new mongoose.Schema({
   fullName: {
     type: String,
     required: [true, "provide your fullName"],
     minLength: [5, "FullName Length Must be at least 5"],
     maxLength: [45, "FullName Length Must be 45 Or Less"],
   },
   email: {
     type: String,
     required: [true, "provide your email"],
     match: [
       /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
       "Provide a valid email",
     ],
   },
   address: {
     type: String,
     required: [true, "provide your address"],
     maxLength: [45, "Address Length Must be 45 Or Less"],
   },
   dateOfBirth: {
     type: String,
     required: [true, "provide the date of your birth"],
     match: [/^\d{4}-\d{2}-\d{2}$/, 
      'Invalid Date Format, it must be Like year-month-days (yyyy-mm-d)'
    ],
   },
   userImagePath: {
     type: String,
   },
 });


  const Job = mongoose.model('Job', jobSchema);
  module.exports = Job



