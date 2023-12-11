import express from "express";

const router = express.Router();

let nm = "Suraj";

router.get("/", (req, res) => {
  res.render("login", { name: nm });
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.get("/projects", (req, res) => {
  res.render("projects");
});

router.get("/create_project", (req, res) => {
  res.render("create_project");
});

router.get("/project", (req, res) => {
  res.render("project");
});

router.post("/", (req, res) => {
  // const abc = {
  //   name: req.body.name,
  //   description: req.body.password,
  // };
  //res.render("home", req.body.name);
  nm = req.body.name + req.body.password;
  res.redirect("/");
});

export default router;
