const multer = require('multer')



  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "./images/");
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });
 
  const fileFilter = (req, file, cb) => {
    // validate the file
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
      cb(null, true)
    } else {
     cb(new Error("the file must be an Image"), false);
    }
  }

   
  const multerConfig = multer({
    storage: storage,
    limits: { fileSize: 2000000 },
    fileFilter: fileFilter
  });


  const upload = multer(multerConfig).single("image"); 








  module.exports = upload