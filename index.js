// imports
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const { fireApp, auth } = require("./firebase");
const {
  createUserWithEmailAndPassword,
  updateProfile,
} = require("firebase/auth");

// main variables
const app = express();
const port = process.env.PORT || 3000;

// set the view engine to ejs and other parameters
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// home page
app.get("/", (req, res) => {
  res.render("index");
});

// patient dashboard
app.get("/patient-dashboard", (req, res) => {
  res.render("patientdashboard");
});

app.post("/register", (req, res) => {
  let name = req.body.nameReg;
  let mail = req.body.emailReg;
  let pass = req.body.passReg;
  let role = req.body.roleReg;
  /*createUserWithEmailAndPassword(auth,mail,pass)
    .then((user)=>{
        updateProfile(auth.currentUser, {
            displayName: `${name}#${role}`
        }).then(()=>{console.log(auth.currentUser.displayName);})
    }).catch((err)=>{
        console.log(err);
    })*/
  console.log(role);
});

app.listen(port);
