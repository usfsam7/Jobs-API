const express = require('express')
  const mongoose =  require('mongoose')
     require('dotenv').config()
       const jwt = require('jsonwebtoken')
       const bcrypt = require('bcrypt')
       const User = require('./Models/user_model')
       const Job = require('./Models/job_model')
       const multer = require('multer')
       const app = express()
       const bodyParser = require('body-parser')

          app.listen(3000, () => {
             console.log("Server is running on port 3000 ...");
           });
   
         mongoose.connect(process.env.MONGO_URI,
          { useNewUrlParser: true, useUnifiedTopology: true }, () => {
            console.log("Connected to db ...");
         });
    
    

         // Middlewares
         app.use(express.json());
         app.use(bodyParser.urlencoded({ extended: true }))
         
         


         // Routes

          // Create User => (Registration) ..
      app.post('/api/register', async (req, res) => {
        const { username, password } = req.body;
            // checking if user inserted data or not
          if (!username || !password) return res.json({ msg: "Missing Credentials" });
              // checking if inserted username used before or not
             const user = await User.findOne({ username: username });
               if (user) return res.json({ msg: "Username Already Exist, user another One" })
                   // checking if inserted data meeting the criteria or not
                  const userToValidate = new User({ username: username, password: password }); 
                    const err = userToValidate.validateSync();
                      if (err) {
                           res.json({ validationError: err.message })
                         } else {
                          const hashedPass = await bcrypt.hash(password, 10);
                         let newUser = new User({ username: username, password: hashedPass });
                          // saving user with hashed password
                      newUser.save()
                    res.json({ newUser })
                  }  
                });


      app.post('/api/login', async (req, res) => {
          const { username, password } = req.body;
               // checking if user inserted data or not
           if (!username || !password) return res.json({ msg: "Missing Credentials" });
                // checking validity of inserted data
            const userData = await User.findOne({ username: username });
              if (!userData) return res.json({ msg: "Invalid Credentials" });
                  // comparing inserted password with original password
                const passMatching = await bcrypt.compare(password, userData.password);
                      if (!passMatching) return res.json({ msg: "Incorrect Password" });
                        // sending token
                      const name = userData.username;
                    const id = userData.id;
                        // data stored in token
                   const user = { id, name }
                const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '25d' })            
              res.json({ token });
          });    

 
           const authMiddleware =  (req, res, next) => {
  /*
  You Can save Token In Which Place You Want ( Like Cookies ) To Be Able To Access It In The Verification Step
  */
         const authHeaders = req.headers.token
         console.log(req.headers)
          if (!authHeaders || !authHeaders.startsWith('Bearer ')) return res.json({
             msg: "No Token Provided" 
          });
        
          const accessToken = authHeaders.split(' ')[1]
            jwt.verify(accessToken, process.env.JWT_SECRET, (error, payload) => {
               if (error) return res.json({ msg: "Sorry, you can't access this route" });
               const { id, username } = payload
               req.user = { id, username }
               next()
            })
          }

             // get all users
           app.get('/api/all-users', authMiddleware, async (req, res) => { 
             const users = await User.find({});
             res.json({users});
          });
   
       
              

          

         // multer configuration
     const multerConfig = multer({ dest: 'images/', limits: { fileSize: 2000000 } })
     const upload =  multer(multerConfig).single('image'); 

  app.post('/api/apply', authMiddleware, async (req, res) => { upload(req, res, async (err, next) => {
        if (err instanceof multer.MulterError) return res.json({ msg: err.message });
         if (err) return res.json({ msg: err.message });
         const userImagePath = req.file.path;   

      const { fullName, email, address, dateOfBirth } = req.body;
       if (!fullName || !email || !address || !dateOfBirth)  return res.json({
          msg: "Missing Credentials",
        });

          // data to check validity
        const newJob = new Job({
           fullName: fullName,
           email: email,
           address: address,
           dateOfBirth: dateOfBirth,
        });

         // checking if inserted data meeting the criteria or not
       const error = newJob.validateSync();
         if (error) return res.json({ validationError: error.message });

        // checking if inserted email used before or not
      const jobEmail = await Job.findOne({ email: req.body.email });
        if (jobEmail) return res.json({ msg: "Email Already used, use another one" });

         // Getting user Age
      const userAge = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
        if (userAge < 20) return res.json({ mgs: "Unavailable Age" });

        const jobData = new Job({ 
            fullName: fullName,
            email: email,
            address: address,
            dateOfBirth: dateOfBirth,
            userImagePath: userImagePath,
         });
         
        jobData.save() 
        res.json({ jobData })

    });       
  });

      

       app.get('/api/applications', authMiddleware, async (req, res) => {
           const allJobs = await Job.find({});
            res.json({ allJobs })
       });

