var mysql = require('mysql');
const { check, validationResult } = require("express-validator");
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');


var con = mysql.createConnection({
 
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,


});


con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to database!");

});

exports.signupMethod =   (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const email = req.body.email;
  const password = req.body.password;
  const name = req.body.name;
    //inserting user intp db
    var sql = "insert into user(name , password, email ) values ('"+ req.body.name +"','"+ req.body.password +"','"+req.body.email+"')";
    con.query(sql, function (err, result, fields)
    {
      if (err){
        throw err;
      }
      //getting userid
      sql = "select userid from user where email = '"+email+"';" ;
      con.query(sql, function (err, result, fields)
      {
        if (err){
          throw err;
        }
        result = JSON.parse(JSON.stringify(result));
        var userid = result[0].userid;




      //creating user's shopping list
      var listname = userid+"list";
      var list = "create table " +listname+"(itemid int(5), quantity int(3));";

      con.query(list, function (err, result, fields)
      {
        if (err){
          throw err;
        }

      });
      //creating user's family mem listen
       listname = userid+"famlist";
      var famlist = "create table " +listname+"(userid int(3) unique, FOREIGN KEY(userid) REFERENCES user(userid));";

      con.query(famlist, function (err, result, fields)
      {
        if (err){
          throw err;
        }


        res.status(200).send("user's profile created!");
      });
      });


    });

};

exports.signinMethod = (req,res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const email = req.body.email;
  const password = req.body.password;

  var sql = "select email from user where email = '"+ email +"';";
  con.query(sql, function (err, result, fields)
  {
    if (err){
      throw err;
    }
    if(result.length != 0){
        //email matched
        var sql = "select password from user where password = '"+ password +"';";
        con.query(sql, function (err, result, fields)
        {
          if (err){
            throw err;
          }
          if(result.length != 0 ){
            //password matched
            //creating token
            var token = jwt.sign({ email: req.body.email }, process.env.SECRET);
            
            res.json({token: token});
          }
          else{
            res.send('incorrect password');
          }
        });



      }
      else{
        res.send('wrong email');
      }
});

};

exports.isAuthorised = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if(token == null) return res.sendStatus(401);

  jwt.verify(token , process.env.SECRET, (err, email) =>{
    if(err) return res.sendStatus(403);

    req.email = email;
    next();
  })
}
