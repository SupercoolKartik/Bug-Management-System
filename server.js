const express = require("express");
const path = require("path");
const ejs = require("ejs");
const app = express();
const bodyParser = require("body-parser");

const port = process.env.PORT || 3000;
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

let nm = "Suraj";

app.get("/", (req, res) => {
  res.render("login", { name: nm });
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/projects", (req, res) => {
  res.render("projects");
});

app.get("/create_project", (req, res) => {
  res.render("create_project");
});

app.get("/project", (req, res) => {
  res.render("project");
});

app.post("/", (req, res) => {
  // const abc = {
  //   name: req.body.name,
  //   description: req.body.password,
  // };
  //res.render("home", req.body.name);
  nm = req.body.name + req.body.password;
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
