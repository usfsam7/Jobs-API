   const Job = require('./Models/job_model')
   const multer = require('multer')



       // multer configuration
     const multerConfig = multer({ dest: 'images/', limits: { fileSize: 2000000 } })
     const upload =  multer(multerConfig).single('image'); 
   
const Apply =  async (req, res) => { upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) return res.json({ msg: err.message });
    if (err) return res.json({ msg: err.message });
       const userImagePath = req.file.path;
     
      const { fullName, email, address, dateOfBirth } = req.body;
        if (!fullName || !email || !address || !dateOfBirth)
          return res.json({ msg: "Missing Credentials" });
     
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
     
             // job-data to save
          const jobData = new Job({
            fullName: fullName,
            email: email,
            address: address,
            dateOfBirth: dateOfBirth,
            userImagePath: userImagePath,
          });
       
         jobData.save();
         res.json({ jobData });

      });       
    }


const getAllJobs = async (req, res) => {
           const allJobs = await Job.find({});
            res.json({ allJobs })
         }



    module.exports = {
      Apply,
      getAllJobs,
    }