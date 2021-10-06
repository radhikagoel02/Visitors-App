const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Data = require("./models/user");
const methodOverride = require("method-override");

mongoose
  .connect("mongodb://localhost:27017/reception-db")
  .then(() => {
    console.log("DB CONNECTED");
  })
  .catch((err) => {
    console.log(err);
  });
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
  try {
    const data = await Data.find({});
    res.render("home", { data });
  } catch {
    (err) => console.log(err);
  }
});

app.get("/enter", (req, res) => {
  res.render("enter");
});

app.post("/", async (req, res) => {
  const { name, email, phone } = req.body;
  let date = new Date();
  let checkInHrs = date.getHours();
  let checkInMins = date.getMinutes();
  try {
    await sendemail(email, checkInHrs, checkInMins);
    await Data.create({ name, email, phone, checkInHrs, checkInMins });
    res.redirect("/");
  } catch {
    (err) => console.log(err);
  }
});

app.put("/:id", async (req, res) => {
  const { id } = req.params;
  let date = new Date();
  let checkOutHrs = date.getHours();
  let checkOutMins = date.getMinutes();
  try {
    const user = await Data.findById(id);
    await sendexmail(user.email, checkOutHrs, checkOutMins);
    await Data.findByIdAndUpdate(id, {
      $set: { status: "Checked Out", checkOutHrs, checkOutMins },
    });
    res.redirect("/");
  } catch {
    (err) => console.log(err);
  }
});

app.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Data.findByIdAndDelete(id);
    res.redirect("/");
  } catch {
    (err) => console.log(err);
  }
});

function sendemail(email, checkInHrs, checkInMins) {
  const sgMail = require("@sendgrid/mail");
  const sendgrid = sgMail.setApiKey(
    "SG.x0UGn_XmR2uPsrZ84SRE7Q.Mih4_XexZm9uNadLE4vqK - bCC - Ab9z9dU6bcGuaaH1g"
  );
  let hrs = checkInHrs.toString();
  let mins = checkInMins.toString();
  if (checkInMins <= 9) {
    mins = "0" + checkInMins.toString();
  }
  if (checkInHrs <= 9) {
    hrs = "0" + checkInHrs.toString();
  }
  const msg = {
    to: email,
    from: "radhika0321.cse19@chitkara.edu.in",
    subject: "Entering building",
    text: `Hi you entered the building at ${hrs}:${mins}`,
  };
  sendgrid.send(msg);
}

function sendexmail(email, checkOutHrs, checkOutMins) {
  const sgMail = require("@sendgrid/mail");
  const sendgrid = sgMail.setApiKey(
    "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"
  );
  let mins = checkOutMins.toString();
  let hrs = checkOutHrs.toString();
  if (checkOutMins <= 9) {
    mins = "0" + checkOutMins.toString();
  }
  if (checkOutHrs <= 9) {
    hrs = "0" + checkOutHrs.toString();
  }
  const msg = {
    to: email,
    from: "radhika0321.cse19@chitkara.edu.in",
    subject: "Checking out",
    text: `Hi you checked out at ${hrs}:${mins}`,
  };
  sendgrid.send(msg);
}

const port = process.env.PORT || 3000;
app.listen(port);
