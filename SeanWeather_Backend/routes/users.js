var express = require('express');
var router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 
  
router.post("/register", async function (req, res, next) {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  
  if (!email || !password){
    return res.status(400).json({
      error: true, 
      message: "Email or Password is empty"
    });
    return;
  }

  const queryUsers = await req.db
    .from("users")
    .select("*")
    .where("email", "=", email);
  
  if( queryUsers.length > 0 ){
    console.log("user already exists");

    return res.status(400).json({
      error: true, 
      message: "Email already exists"
    });
    return;
  }

  const saltRounts = 10;
  const hash =  bcrypt.hashSync(password, saltRounts);
 
  await req.db.from("users").insert({email, password: hash, username});

  res.status(201).json({error: false, message: "Usera registered successfully"});

});

router.post("/login", async function (req, res, next){
  const email = req.body.email;
  const password = req.body.password; 

  if (!email || !password){
    return res.status(400).json({
      error: true, 
      message: "Email or Password is empty"
    });
    return;
  }


  const queryUsers = await req.db
    .from("users")
    .select("*")
    .where("email", "=", email);
  
  if( queryUsers.length === 0 ){
    console.log("user doesn't exists");

    return res.status(400).json({
      error: true, 
      message: "User doesn't exists"
    });
    return;
  }

  const user = queryUsers[0];
  const match = await bcrypt.compare(password, user.password);

  if(!match){
    return res.status(400).json({
      error: true, 
      message: "Password is wrong"
    });
    return;
  }
  
  //console.log("user : " , user);
  const user_id = user.id;
  const expires_in = 60 * 60 * 24; // 24 hours

  const exp = Date.now() + expires_in * 1000;

  const token = jwt.sign({user_id, exp}, process.env.JWT_SECRET);
  res.status(200).json({token_type: "Bearer", token, expires_in});
  

});

module.exports = router;
