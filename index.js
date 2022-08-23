// imports
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const { fireApp, auth, db } = require("./firebase");
const {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
} = require("firebase/auth");
const {
  onSnapshot,
  query,
  where,
  collection,
  addDoc,
  setDoc,
  doc,
  updateDoc,
} = require("firebase/firestore");

fireUser = {};

// main variables
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

// set the view engine to ejs and other parameters
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//Getting Realtime Updates
// Variables:
docList = [];
appList = [];
reqList = [];
//Doctors List-Patients
if (fireUser.uid) {
  const docQ = query(collection(db, "users"), where("role", "==", "d"));
  const unsubDoc = onSnapshot(docQ, (querySnapshot) => {
    let f_list = [];
    querySnapshot.forEach((doc) => {
      f_list = [...f_list, { ...doc.data(), id: doc.id }];
    });
    docList = f_list;
  });
  //Appointments List-Both
  const appQ = query(
    collection(db, "appoints"),
    where(
      fireUser.displayName.split("#")[1] == "p" ? "patient" : "doctor",
      "==",
      fireUser.email
    )
  );
  const unsubApp = onSnapshot(appQ, (querySnapshot) => {
    let f_list = [];
    querySnapshot.forEach((doc) => {
      f_list = [...f_list, { ...doc.data(), id: doc.id }];
    });
    appList = f_list;
  });
  //Appointments Requests-Doctors
  const reqQ = query(
    collection(db, "appoints"),
    where("doctor", "==", fireUser.email),
    where("status", "==", "req")
  );
  const unsubReq = onSnapshot(reqQ, (querySnapshot) => {
    let f_list = [];
    querySnapshot.forEach((doc) => {
      f_list = [...f_list, { ...doc.data(), id: doc.id }];
    });
    reqList = f_list;
  });
}

// home page
app.get("/", (req, res) => {
  res.render("index");
});

// patient dashboard
app.get("/home", (req, res) => {
  console.log(req.url);
  res.render("patientdashboard", { fireUser });
});

// Sign Up Post Request
app.post("/register", (req, res) => {
  let name = req.body.nameReg;
  let mail = req.body.emailReg;
  let pass = req.body.passReg;
  let role = req.body.roleReg;
  createUserWithEmailAndPassword(auth, mail, pass)
    .then(() => {
      setDoc(doc(db, "users", mail), {
        name: name,
        role: role,
        photo:
          "https://library.kissclipart.com/20181001/wbw/kissclipart-gsmnet-ro-clipart-computer-icons-user-avatar-4898c5072537d6e2.png",
      });
      updateProfile(auth.currentUser, {
        displayName: `${name}#${role}`,
      }).then(() => {
        fireUser = auth.currentUser;
      });
    })
    .catch((err) => {
      console.log(err);
    });
  console.log(role);
  res.redirect("/home");
});

// Logging In Post Request
app.post("/login", (req, res) => {
  let mail = req.body.emailLog;
  let pass = req.body.passLog;
  signInWithEmailAndPassword(auth, mail, pass)
    .then((user) => {
      fireUser = user;
      console.log(fireUser.uid);
      res.redirect("/home");
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/find", (req, res) => {
  res.render("findDocs", { docList });
});

// Requesting Appointments - Patient
app.post("/appoint", (req, res) => {
  console.log("running eeee");
  let mail = req.body.id;
  let time = req.body.time;
  console.log(time);
  console.log(req.body);
  addDoc(collection(db, "appoints"), {
    doctor: mail,
    patient: auth.currentUser.email,
    time: time,
    status: "req",
  });
});

//Accepting Appointments - Doctor
app.post("/acceptAppoint", (req, res) => {
  id = req.body.appointID;
  updateDoc((db, "appoints", id), {
    status: "set",
  });
});
//Rejecting Appointments - Doctor
app.post("/declineAppoint", (req, res) => {
  id = req.body.appointID;
  updateDoc((db, "appoints", id), {
    status: "dec",
  });
});

//Sending Reports - Doctor
app.post("/sendReport", (req, res) => {
  pMail = req.body.patientMail;
  vitB = req.body.vitB;
  vitD = req.body.vitD;
  chol = req.body.cholestrol;
  sugar = req.body.sugar;
  iron = req.body.iron;
  addDoc(collection(db, "report"), {
    doctor: auth.currentUser.email,
    patient: pMail,
    vitB: vitB,
    vitD: vitD,
    cholestrol: chol,
    sugar: sugar,
    iron: iron,
  });
});

diag = [];
app.post("/diagnosis", (req, res) => {
  dt = req.body.report;
  //Vitamin B
  if (dt.vitB < 120) diag = [...diag, { vitB: { lvl: "low", stat: "Anemia" } }];
  else if (dt.vitB > 700)
    diag = [...diag, { vitB: { lvl: "high", stat: "Anemia" } }];
  else diag = [...diag, { vitB: { lvl: "normal", stat: null } }];

  //Vitamin D
  if (dt.vitD < 50)
    diag = [...diag, { vitD: { lvl: "low", stat: "Osteomalacia" } }];
  else if (dt.vitB > 120)
    diag = [...diag, { vitD: { lvl: "high", stat: "Osteomalacia" } }];
  else diag = [...diag, { vitD: { lvl: "normal", stat: null } }];

  //Cholestrol
  if (dt.cholestrol < 50)
    diag = [...diag, { cholestrol: { lvl: "low", stat: "Hipertensión" } }];
  else if (dt.cholestrol > 150)
    diag = [...diag, { cholestrol: { lvl: "high", stat: "Hipertensión" } }];
  else diag = [...diag, { cholestrol: { lvl: "normal", stat: null } }];

  //Sugar
  if (dt.sugar < 140)
    diag = [...diag, { sugar: { lvl: "low", stat: "Diabetes" } }];
  else if (dt.sugar > 200)
    diag = [...diag, { sugar: { lvl: "high", stat: "Diabetes" } }];
  else diag = [...diag, { sugar: { lvl: "normal", stat: null } }];

  //Iron
  if (dt.iron < 8) diag = [...diag, { iron: { lvl: "low", stat: "Anemia" } }];
  else if (dt.iron > 12)
    diag = [...diag, { iron: { lvl: "high", stat: "Anemia" } }];
  else diag = [...diag, { iron: { lvl: "normal", stat: null } }];
});

// Sending Message in Appointment Chat - Both
app.post("/sendMessage", (req, res) => {
  msg = req.body.chatMsg;
  addDoc(collection(db, "chat"), {
    by: auth.currentUser.email,
    for: req.url.substring(1, req.url.length),
    msg: msg,
  });
});

app.get("/inputTest", (req, res) => {
  res.render("inputs", { docList });
});

app.listen(port);
