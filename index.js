var express     =   require("express"),
    app         =   express(),
    bodyParser  =   require("body-parser")
    session     =   require('express-session'),
    path        =   require('path');

const AUTHY_API_KEY = process.env.AUTHY_KEY;
const authy = require('authy')(AUTHY_API_KEY)

app.use(session({ secret: "Iron Man Is Gonna Die In Infinity War" }));
app.use(bodyParser.urlencoded({ extended: false }))
app.set("view engine" ,"ejs")

app.get("/",function(req,res){
    res.render('../views/main')
})

app.post('/auth',function(req,res){
  var number = req.body.number;
  var country_code = req.body.countryCode;
  var info = {
    via : "SMS" ,
    locale : "EN"
  }
  req.session.userNumber={
    cc : country_code,
    no : number
  };
  if(number){
    authy.phones().verification_start(number,country_code , info ,function(err,response){
      if (err) {
        console.log(err);
      } else {
        res.redirect("/val");
      }
    })
}
})

app.get('/val',function(req,res){
  res.render('../views/val')
})

app.post('/val',function(req,res){
  const number = req.session.userNumber.no;
  const country_code = req.session.userNumber.cc;
  const otp = req.body.otp;
  authy.phones().verification_check(number,country_code,req.body.otp,function(err,response){
    if (err) {
      console.log(err);
    } else {
      res.json({
          message : "Successfully Authenticated"
      })
    }
  })
})

app.listen(8000,function(){
    console.log("Ready To Rock!");
})