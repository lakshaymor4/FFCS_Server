const otpGenerator = require("otp-generator");
const express = require("express");

const app = express();
const path = require("path");
const cors = require("cors");
const nodemailer = require("nodemailer");
// const bodyParser = require("body-parser");
app.use(express.json());
app.use(cors());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
const mongoose = require("mongoose");
const { stringify } = require("querystring");
mongoose
  .connect("mongodb://127.0.0.1:27017/userinfo")
  .then(() => {
    console.log("Connection Successfull");
  })
  .catch((e) => {
    console.log(e);
    console.log("Err");
  });
var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "noreplyotp2@gmail.com",
    pass: "lajivsomamunpxng",
  },
});
const sav = new mongoose.Schema({
  Ema: String,
  data: Array,
});
const Vrt = mongoose.model("Vrt", sav);
const signupschema = new mongoose.Schema({
  name: String,
  regno: String,
  email: String,
  password: String,
});
const otpli = new mongoose.Schema({
  uu: String,
  ot: String,
});
const User = mongoose.model("User", signupschema);
const TOT = mongoose.model("TOT", otpli);
let x = "";
app.get("/signup", (req, res) => {
  res.json({ msg: x });
});
// app.post("/signup",(req,res)=>{
//     const { user, email, pass, phone, cnfpa,name,regno } = req.body;
let tok = "";
let em = "";
// app.get("/otp", (req, res) => {
//   res.json({ msg: "Nothing to see here!!" });
// });
app.post("/otp", (req, res) => {
  const token = otpGenerator.generate(4, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });
  tok = token;

  console.log(req.body.emaill);
  console.log(em);
  const vt = new TOT({
    uu: req.body.emaill,
    ot: tok,
  });
  TOT.findOneAndUpdate({ uu: req.body.emaill },{ot:tok})
    // .then((us) => {
    //   TOT.findOneAndUpdate({ us: req.body.email }, { ot: tok });
    // })
    

  var mailOptions = {
    from: "noreplyotp2@gmail.com",
    to: req.body.emaill,
    subject: "OTP for your registration",
    text: token,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
      vt.save();
      
    }
  });
  res.json({ otpp: "Nothing to see here" });
});
let regoo = "";
app.post("/validate", (req, res) => {
  const { namee, pass, regno, emaill, otpp } = req.body;
  console.log(req.body);
  console.log(TOT.findOne({ uu: emaill }));
  TOT.findOne({ uu: emaill }).then((us) => {
    if (otpp != us.ot) {
      console.log("Wrong otp!!!");
      res.json({ mssg: "Wrong OTP" });
    } else {
      console.log("Correct!!!");
      const us = new User({
        name: namee,
        regno: regno,
        email: emaill,
        password: pass,
      });

      us.save();

      res.json({ mssg: "Success" });
    }
  });
});
// })
app.get("/login",(req,res)=>{
  res.json({mssg:""})
})
app.post("/login", (req, res) => {
  const { lrn, lpsw } = req.body;
  User.findOne({ regno: lrn })
    .then((uss) => {
      if (uss.password == lpsw) {
        console.log("Success");

        console.log("rego", regoo);
        
        res.json({ mssg: "loginsuc" });
      } else {
        console.log("Unsuccessfull");
        res.json({ mssg: "Unsuccessfull" });
      }
    })
    .catch((e) => {
      console.log("USer not found!!!");
      console.log(e);
      res.json({ mssg: "Usernfound" });
    });
});
app.post("/app", (req, res) => {
  console.log(req.body);
  const gy = new Vrt({
    Ema: "lakshaymorwal24032004@gmail.com",
    data: req.body,
  });
  gy.save();
  res.json({ msg: "Yo" });
});
app.listen(3000, () => {
  console.log("Listening on port 3000!!!");
});
