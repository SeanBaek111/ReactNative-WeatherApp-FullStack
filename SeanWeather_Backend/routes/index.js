var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
 
  

router.get("/api/city/:CountryCode?", async function (req, res) {
  try{
    const query = req.db.from("City").select("*");

    if( req.params.CountryCode != null){
      query.where("CountryCode" , "=", req.params.CountryCode);
    }
    res.json({error: false, message: "success", city: await query})
  }  catch (err) {
    console.log(err);
    res.status(500).json({error: true, message: "Error in SQL query"});
  }

});

module.exports = router;
