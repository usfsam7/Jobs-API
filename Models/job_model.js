const mongoose = require('mongoose')


 const jobSchema = new mongoose.Schema(
   {
     fullName: {
       required: true,
       type: String,
       minLength: [5, "FullName Length Must be at least 5"],
       maxLength: [45, "FullName Length Must be 45 Or Less"],
     },
     email: {
       required: true,
       type: String,
       match: [
         /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
         "Provide a valid email",
       ],
       unique: true
     },
     address: {
       required: true,
       type: String,
       maxLength: [60, "Address Length Must be 60 Or Less"],
     },
     birth_date: {
       required: true,
       type: String,
       match: [
         /^\d{4}-\d{2}-\d{2}$/,
         "Invalid Date Format, it must be Like year-month-days (yyyy-mm-dd)",
       ],
     },
     image: {
       type: String,
       require: true,
     },
     applied_at: {
       type: Date,
       default: Date.now,
     },
   },
   { versionKey: false }
 );


  const Job = mongoose.model('Job', jobSchema);
  module.exports = Job


