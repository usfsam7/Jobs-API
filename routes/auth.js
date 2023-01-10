     const express = require('express')
      const router = express.Router()
      const authController = require('../Controllers/authController')
      const authMiddleware = require('../Middleware/authMiddleware')


          // Create User => (Registration) ..
      router.post('/register', authController.Registration);

          // login
      router.post('/login', authController.Login);

          // get all users
      router.get('/all-users', authMiddleware, authController.getAllUsers); 


      module.exports = router