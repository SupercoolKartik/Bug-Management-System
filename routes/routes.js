import express from "express";
import fs from "fs/promises";
import pool from "../pool.mjs";
import ejs from "ejs";

const router = express.Router();

let nm = "Suraj";

router.get("/main", (req, res) => {
  res.render("main");
});
router.get("/", (req, res) => {
  res.render("login", { name: nm });
});

router.get("/signup", (req, res) => {
  res.render("signup", { err_mess: "" });
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

router.get("/dbData", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      `INSERT INTO users01 (id, username, email) VALUES (1,"suraj","s@abc")`,
      (err, result) => {
        if (err) {
          res.send(err);
        }
      }
    );
    connection.query("SELECT * FROM users01", (err, result) => {
      if (err) throw err;
      res.send(result);
      // Release the connection back to the pool
      connection.release();
    });
  });
});

export default router;
