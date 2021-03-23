var mysql = require("mysql");

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



exports.getList =  (req, res) => {

  var sql = "select userid from user where email = '"+ req.email.email +"';" ;
  con.query(sql, function (err, result, fields)
  {
    if (err){
      throw err;
    }
    result = JSON.parse(JSON.stringify(result));
    var userid = result[0].userid;


  var listname = userid + "list";
  var sql = "select * from "+ listname + ";" ;

  con.query(sql, function (err, result, fields)
  {
    if (err){
      throw err;
    }
    res.json(JSON.parse(JSON.stringify(result)));

  });
});
};

exports.addItem = (req, res) => {
  var sql = "select userid from user where email = '"+ req.email.email +"';" ;
  con.query(sql, function (err, result, fields)
  {
    if (err){
      throw err;
    }
    result = JSON.parse(JSON.stringify(result));
    var userid = result[0].userid;

  var listname = userid + "list";
  var sql = "insert into "+listname +" values("+req.query.itemid+","+ req.query.quantity+");";

  con.query(sql, function (err, result, fields)
  {
    if (err){
      throw err;
    }
    res.send('item added to your list');

  });
});
};

exports.getFamlist =  (req, res) => {

  var sql = "select userid from user where email = '"+ req.email.email +"';" ;
  con.query(sql, function (err, result, fields)
  {
    if (err){
      throw err;
    }
    result = JSON.parse(JSON.stringify(result));
    var userid = result[0].userid;


  var listname = userid + "famlist";
  var sql = "select user.userid, user.name, user.email from user natural join "+ listname + ";" ;

  con.query(sql, function (err, result, fields)
  {
    if (err){
      throw err;
    }
    res.json(JSON.parse(JSON.stringify(result)));

  });
});
};

exports.addFamlist = (req, res) => {
var sql = "select email, password, userid  from user where email = '"+ req.body.email +"';";
  con.query(sql, function (err, result, fields)
  {
    if (err) {
    console.log(err);
    res.sendStatus(500);
    return;
    }
    result = JSON.parse(JSON.stringify(result));
    if(result.length != 0 && result[0].password == req.body.password){
      const famUserid = result[0].userid;
      //getting user's id
      var user = "select userid from user where email = '"+ req.email.email +"';" ;
                con.query(user, function (err, result, fields)
                {
                  if (err) {
                    console.log(err);
                    res.sendStatus(500);
                    return;
                  }
                  result = JSON.parse(JSON.stringify(result));
                  var userid = result[0].userid;

                  //adding to user's famlist
                  var famlistname = userid+ "famlist";
                             var sql = "insert into "+famlistname +" values("+ famUserid+");";

                             con.query(sql, function (err, result, fields)
                             {
                               if (err) {
                                   console.log(err);
                                     res.sendStatus(500);
                                     return;
                               }


                             });

                    // adding to fam mem's famlist
                    var famlistname = famUserid+ "famlist";
                               var sql = "insert into "+famlistname +" values("+ userid+");";

                               con.query(sql, function (err, result, fields)
                               {
                                 if (err) {
                                     console.log(err);
                                       res.sendStatus(500);
                                       return;
                                 }

                               });
                });
      res.send('family member added successfully');
    }
    else{
      res.send("invalid email/password or the family member to be added might not be an existing user!!");
    }
  });
};


exports.famShoppingList = (req, res) => {
  var user = "select userid from user where email = '"+ req.email.email +"';" ;
            con.query(user, function (err, result, fields)
            {
              if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
              }
              result = JSON.parse(JSON.stringify(result));
              var userid = result[0].userid;


  //check wheather the id provided is an existing fam member
  var famlistname = userid + "famlist";
  var sql = "select * from "+ famlistname+" where userid = "+ req.params.id +";" ;
  con.query(sql, function (err, result, fields)
  {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }
      if(result.length != 0){
        var listname = req.params.id + "list";
        var sql = "select * from "+ listname + ";" ;

        con.query(sql, function (err, result, fields)
        {
          if (err){
            throw err;
          }
          res.json(JSON.parse(JSON.stringify(result)));

        });
      }
      else{
        res.send('invalid family member');
      }

  });

});
};
