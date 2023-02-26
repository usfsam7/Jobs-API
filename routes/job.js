    const express = require('express')
    const router = express.Router()
    const jobController = require('../Controllers/jobController')
    const authMiddleware = require('../Middleware/authMiddleware')


    
         // applying for the job
    router.post('/apply', authMiddleware, jobController.Apply);

           // get all applications
    router.get('/applications', authMiddleware, jobController.getAllJobs);

    module.exports = router