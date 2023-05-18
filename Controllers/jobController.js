   const Job = require('../Models/job_model')
   const multer = require('multer')



       // multer configuration
     const multerConfig = multer({ dest: 'images/', limits: { fileSize: 2000000 } })
     const upload =  multer(multerConfig).single('image'); 
   
const Apply =  async (req, res) => { upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) return res.json({ msg: err.message });
    if (err) return res.json({ msg: err.message });
 
      if (!req.file) return res.json({ msg: 'please, upload your image' }); 
       const userImagePath = req.file.path;
      console.log(userImagePath)
      const { fullName, email, address, dateOfBirth } = req.body;
        if (!fullName || !email || !address || !dateOfBirth)
          return res.json({ msg: "Missing Credentials" });
     
             // user_data to check validity
           const new_job = new Job({
             fullName: fullName,
             email: email,
             address: address,
             dateOfBirth: dateOfBirth,
           });
     
                // checking if inserted data meeting the criteria or not
             const error = new_job.validateSync();
              if (error) return res.json({ validationError: error.message });
     
                // checking if inserted email used before or not
             const user_email = await Job.findOne({ email: req.body.email });
              if (user_email) return res.json({ msg: "Email Already used, use another one" });
     
            // Getting user Age
         const user_age = new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
          if (user_age < 20) return res.json({ mgs: "Unavailable Age" });
     
             // job-data to save
          const user_data = new Job({ 
            fullName: fullName,
            email: email,
            address: address,
            dateOfBirth: dateOfBirth,
            userImagePath: userImagePath,
          });
       
         user_data.save();
         res.json({ user_data });

      });       
    }


const getAllJobs = async (req, res) => {
           const all_jobs = await Job.find({});
            res.json({ all_jobs })
         }



    module.exports = {
      Apply,
      getAllJobs,
    }


    