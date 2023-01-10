    const express = require('express')
    const router = express.Router()
    const jobController = require('../Controllers/jobController')


    
         // applying for the job
    router.post('/apply', jobController.Apply);

           // get all applications
    router.get('/applications', jobController.getAllJobs);

    module.exports = router