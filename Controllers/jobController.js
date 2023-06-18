   const Job = require('../Models/job_model')
   const multer = require('multer')
   const upload  = require('../multer_config')

  
   
     
const Apply =  async (req, res) => { upload (req, res, async (err) => {
    if (err instanceof multer.MulterError) return res.json({ msg: err.message });
    if (err) return res.json({ msg: err.message });
 

      if (!req.file) return res.json({ msg: 'please, upload your image' }); 
       const image_path = req.file.path;

       const { fullName, email, address, birth_date } = req.body;
        if (!fullName || !email || !address || !birth_date)
          return res.json({ msg: "Missing Credentials" });
             
             // user_data to check validity
           const new_job = new Job({
             fullName: fullName,
             email: email,
             address: address,
             birth_date: birth_date,
           });
     
     
                // checking if inserted data meeting the criteria or not
             const error = new_job.validateSync();
              if (error) return res.json({ validationError: error.message });
     
                // checking if inserted email used before or not
             const applicant_email = await Job.findOne({ email: req.body.email });
              if (applicant_email) return res.json({ msg: "already applied" });
     
            // the age of the user
         const applicant_age = new Date().getFullYear() - new Date(birth_date).getFullYear();
          if (applicant_age < 20) return res.json({ mgs: "Unavailable Age" });
     
             // job-data to save
          const applicant_data = new Job({
            fullName: fullName,
            email: email,
            address: address,
            birth_date: birth_date,
            image: image_path,
          });
       
         applicant_data.save();
         res.json({ applicant_data });

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


    