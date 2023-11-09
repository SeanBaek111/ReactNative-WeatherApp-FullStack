var express = require('express');
var router = express.Router();

const jwt = require("jsonwebtoken");

const authorize = (req, res, next) => {
    const authorization = req.headers.authorization;
    let token = null; 
  
    // Retrieve token
    if (authorization && authorization.split(" ").length === 2) {
      token = authorization.split(" ")[1];
      console.log("Token retrieved: ", token);
    } else {
      console.error("Unauthorized user - token not found in authorization header");
      return res.status(401).json({ error: "Unauthorized user" });
    }
  
    // Verify JWT and check expiration date
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
     
      if (decoded.exp < Date.now()) {
        console.error("Token has expired");
        return res.status(401).json({ error: "Token has expired" });
      }
  
      req.user_id = decoded.user_id;
      // Permit user to advance to route
      console.log("Token is valid, user authorized"); 
      next();
    } catch (e) {
      console.error("Token is not valid: ", e);
      return res.status(401).json({ error: "Invalid token" });
    }
  }
  

router.delete("/remove", authorize, async function (req, res){
  try{

   // console.log("reqqq :",req);
    const city_id = req.body.id;
    const user_id = req.user_id;

    await req.db.from("favorites")
              .where({ user_id, city_id})
              .del(); 
    res.json({error: false, message: 'Favorite removed successfully'});

  }catch(error){
    console.log(error);
    res.status(500).json({ error: true, message: 'Server error', error});
  }

});


router.get("/list", authorize, async function (req, res){
  try{
  
    const user_id = req.user_id;

   const favorites =  await req.db.from("favorites")
              .select("City.ID as id", "City.Name as name")
              .where({ user_id })
              .innerJoin("City", "favorites.city_id", "City.id");
    console.log("favorites " , favorites);
    res.json({error: false, message: 'Favorite list retrieved successfully', data: favorites});

  }catch(error){
    console.log(error);
    res.status(500).json({ error: true, message: 'Server error', error});
  }

});
 

router.post("/add", authorize, async function (req, res) {

  try {
    //console.log("req.decoded " , req.decoded);
    const city_id = req.body.id;
  //  const email = req.decoded.email;

  
    const user_id = req.user_id;

    console.log(user_id, " : ", city_id);
    await req.db.from("favorites").insert({ user_id, city_id });

    res.json({ error: false, message: 'Favorite added successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: true, message: 'Server error', error });
  }

});

module.exports = router;
