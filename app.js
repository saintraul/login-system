 //jshint esversion:6
 require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs =require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");


const app = express();
app.use(express.static("public"));

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect("mongodb://localhost:27017/pino", {useNewUrlParser: true});

const userSchema = new mongoose.Schema ({
email:String,
password:String
});

//cerate the secret string into file .env and the .plugin before creating the mongoose Model

//encrypting the password with secret string .env
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password'] });

//Model
const User = new mongoose.model("usertable", userSchema);


app.get("/", function(req,res){

res.render("home");


});

app.get("/login", function(req,res){

res.render("login");


});

app.get("/register", function(req,res){

res.render("register");


});

app.post("/login", function(req,res){
//creating new user when user submit data
const username = req.body.username;
const pass = req.body.password;

User.findOne({email:username},function(error,found){
//when you want to find the user data mongoose will decrypt the password of the user
  if (error) {
    console.log(error);
  }else {
    if (found.password === pass) {

      res.render("secrets");
    }else {
      res.status(200).send('<h1>wrong password</h1>');
    }
  }



});

})
app.post("/register", function(req,res){
//creating new user when user submit data
const newuser = new User({
email:req.body.username,
password:req.body.password
});

newuser.save(function(error){

if (error) {
  console.log(error);
}else {
  res.render("secrets");
}


})

})

app.listen(3000, function(){

console.log("connection 3000");


})
