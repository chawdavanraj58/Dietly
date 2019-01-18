var express = require("express");
var Connect = require("./Connect");
var Crypt = require("./Cryptograph");
var sequel = require("./sequel");

var exp = express();

exp.set("view engine","ejs");
var bodyParser = require('body-parser');
exp.use(bodyParser.json()); 
exp.use(bodyParser.urlencoded({ extended: true })); 

var mysql = require("mysql");

Connect.tryConnect();

exp.get("/",function(req,res)
{
    res.render("login",{message: ""});
})


/** for signup form */
exp.get("/signup",function(req,res)
{
    console.log("in signup");
    res.render("forms");
});

/** for signup from */


/** for login */
exp.post("/login",function(req,res)
{
     var uname = req.body.username;
    var pass1 = req.body.password;
    var pass;
    var done = true;
    var totalrows;

    var encryptpromise = new Promise( function (resolve,reject)
    {

        Crypt.encrypto(pass1,function(data)
        {
            pass = data;
            console.log(pass);
            resolve(pass);
        });

    });

    encryptpromise.then(function(pass){ 
    var promise = new Promise(function(resolve,reject)
    {

        console.log("in promise")
        Connect.validate(uname,pass,function(data)
        {
         totalrows = data.length;
         console.log(data);
         resolve(totalrows);
        });
    });


    promise.then(
    function(totalrows)
    {
        console.log(totalrows); 
        console.log("in promise responder");
        if(totalrows != 1)                              //results.length - to find no of rows 
        {
        console.log("Invalid User");
        
        res.render("login",{message: "Invalid User"});
        }
        else
        {
            res.send("welcome  " + uname);
        }
    }   
    );

});
});
/**for login */

/**for signup Post */

exp.post("/signup",function(req,res)
{
    var uname = req.body.username;
    var pass1 = req.body.password;
    var pass;
    var Status1;
    console.log("in signup")

    var encryptpromise = new Promise( function (resolve,reject)
    {

     Crypt.encrypto(pass1,function(data)
     {
            pass = data;
            resolve(pass);
     });

    });

    encryptpromise.then(function(pass){    
    var promiseins = new Promise(function(resolve,reject)
    {

        sequel.insertuser(req,pass,function(data)
        {
            Status1 = data.id;
            console.log(Status1);
            resolve(Status1) ;
        })
    });  

    promiseins.then(
        function(Status1)
        {
            if(Status1 > 0)
            {
                res.send ("registration done  " + uname);
                console.log("registration complete");

            }
        }
    );
 });
   
});

/**for signUp Post */





exp.listen(5858);
console.log("listening");