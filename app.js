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
          if (!username || !password) return res.json({ msg: "Missing Credentials" });
              // check if passed username used before or not
             const user = await User.findOne({ username: username });
               if (user) return res.json({ msg: "Username Already Exist, user another One" })
                  const userToValidate = new User({ username: username, password: password }); 
                    const err = userToValidate.validateSync();
                      if (err) {
                           res.json({ validationError: err.message })
                         } else {
                          const hashedPass = await bcrypt.hash(password, 10);
                         let newUser = new User({ username: username, password: hashedPass });
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

 


             // get all users
           app.get('/', async (req, res) => { 
             const users = await User.findOne({})
             res.send(users)  
          });



  