const express = require('express')
  const mongoose =  require('mongoose')
    require('dotenv').config()
      const jwt = require('jsonwebtoken')
        const bcrypt = require('bcrypt')
         const User = require('./Models/user_model')
           const app = express()


          app.listen(3000, () => {
             console.log("Server is running on port 3000 ...");
           });
   
         mongoose.connect(process.env.MONGO_URI,
          { useNewUrlParser: true, useUnifiedTopology: true }, () => {
            console.log("Connected to db ...");
         });
    
    

         // Middlewares
         app.use(express.urlencoded({ extended: true }))
         app.use(express.json())
         


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
                    res.json(newUser)
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

 
           const authMiddleware = async (req, res, next) => {
  /*
  You Can save Token In Which Place You Want ( Like Cookies Or Sessions ) To Be Able To Access It In The Verification Step
  */
         const authHeader = req.headers.token
        
          if (!authHeader || !authHeader.startsWith('Bearer ')) {
              res.json({ msg: "No Token Provided" });
          }
        
          const accessToken = authHeader.split(' ')[1]
            jwt.verify(accessToken, process.env.JWT_SECRET, (error, payload) => {
               if (error) return res.json({ msg: "Sorry, you can't access this route" });
               const { id, username } = payload
               req.user = payload
               next()
            })
          }

             // get all users
           app.get('/api/all-users', authMiddleware, async (req, res) => { 
             const users = await User.find({});
             res.send(users);
          });

