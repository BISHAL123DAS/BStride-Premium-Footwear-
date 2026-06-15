const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const tokenBlacklistModel = require("../models/blacklistmodel");

async function registerUserController(req, res) {
    const { username, email, password } = req.body;
 
  if (!username || !email || !password) {
    {
      return res
        .status(400)
        .json({ message: "pls provide username,email and password" });
    }
  }

  const isUserAlreadyExist= await userModel.findOne({$or:[{email},{username}]});
  if(isUserAlreadyExist){
    return res.status(400).json({message:"User already exist"});
  }

  const user=await userModel.create({
    username,
    email,
    password:await bcrypt.hash(password,10)
  });
 
  const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"1d"});
  res.cookie("token",token);

  res.status(201).json({message:"User registered successfully",
    user:{
    id:user._id,
    username:user.username,
    email:user.email,
    role: user.role, 
    },});

}

async function loginUserController(req, res) {
    const { email, password } = req.body;
  
    const user = await userModel.findOne({ email });
  
    if (!user) {
      return res.status(400).json({
        message: "Invalid email addressed",
      });
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
  
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }
  
    const token = jwt.sign(
        { id: user._id, username: user.username, role: user.role }, 
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    console.log("token", token);
  
    res.cookie("token", token);
  
    res.status(200).json({
      message: "User login successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role, 
      },
    });
  }


  async function logOutControler(req,res){
    const token= req.cookies.token
    if(token){
      await tokenBlacklistModel.create({token})
    }
    res.clearCookie("token")
    res.status(200).json({
      message:"User Logout Sucessfully"
    })
  }


//   **
//  * @name getMeController
//  * @description get the current logged in user details.
//  * @access private
//  */


async function getMeController(req, res) {
    const user = await userModel.findById(req.user.id);

    res.status(200).json({
        message: "User details fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role, 
        },
    });
}


module.exports={registerUserController,loginUserController,logOutControler,getMeController};