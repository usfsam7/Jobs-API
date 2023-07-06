const User = require("../Models/user_model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Registration = async (req, res) => {  const { username, email, password } = req.body;

  // checking if inserted data meeting the criteria or not
  const userToValidate = new User({
    username: username,
    email: email,
    password: password,
  });
    
   // validating user data
  const err = userToValidate.validateSync();
  if (err) return res.json({ ValidationError: err.message });

  // checking of the username used before or not
  const user = await User.findOne({ username: username });
  if (user) return res.json({ msg: "Username Already used" });

  // checking of the username used before or not
  const user_email = await User.findOne({ email: email });
  if (user_email) return res.json({ msg: "email Already used" });
    
   //  hashing the password for the sake of security
  const hashedPass = await bcrypt.hash(password, 10);
  let newUser = new User({
    username: username,
    email: email,
    password: hashedPass,
  });

   // saving user with hashed password
  newUser.save();
  res.json({ newUser });
};

const Login = async (req, res) => {
  const { username, password } = req.body;
    // checking if user inserted data or not
  if (!username || !password) return res.json({ msg: "Missing Credentials" });
    
     // checking validity of inserted data
  const userData = await User.findOne({ username: username });
  if (!userData) return res.json({ msg: "Invalid Credentials" });
  
    // comparing inserted password with original password
  const passMatching = await bcrypt.compare(password, userData.password);
  if (!passMatching) return res.json({ msg: "Incorrect Password" });
   
     // signing token
  const name = userData.username;
  const id = userData.id;
   
    // data stored in token
  const user = { id, name };
  const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "25d" });
   
  res.json({ token });
};

// get all users
const getAllUsers = async (req, res) => {
  const users = await User.find({});
  res.json({ users });
};

module.exports = {
  Registration,
  Login,
  getAllUsers,
};
