     const express = require('express')
     const mongoose = require('mongoose')
     require('dotenv').config()
       const app = express()
       const bodyParser = require('body-parser')
       const authMiddleware = require('./Middleware/authMiddleware')


          app.listen(3000, () => {
             console.log("Server is running on port 3000 ...");
           });
   
         mongoose.connect(process.env.MONGO_URI,
          { useNewUrlParser: true, useUnifiedTopology: true }, () => {
            console.log("Connected to db ...");
         });
    
    

         app.use(express.json());
         app.use(bodyParser.urlencoded({ extended: true }))
         
         


      const authRouter = require('./routes/auth');
      const jobRouter = require('./routes/job');

      app.use('/api', authRouter);
      app.use('/api', authMiddleware, jobRouter);