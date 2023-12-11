import express from "express";
//import ejs from "ejs";

import { fileURLToPath } from "url";
import { join, dirname } from "path";

const app = express();

const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

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
