  const jwt = require('jsonwebtoken')



// checking if user provided token or not 
           const authMiddleware =  (req, res, next) => {
  /*
  You Can save Token In Which Place You Want ( Like Cookies ) To Be Able To Access It In The Verification Step
  */
         const authHeaders = req.headers.token
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



          module.exports = authMiddleware