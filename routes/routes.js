import express from "express";
import fs from "fs/promises";
import pool from "../pool.mjs";
import ejs from "ejs";
import { uid } from "uid";

const router = express.Router();

let nm = "Suraj";

router.get("/main", (req, res) => {
  res.render("main");
});
router.get("/", (req, res) => {
  console.log(uid());
  res.render("login", { name: nm });
});

router.get("/signup", (req, res) => {
  res.render("signup", { err_mess: "" });
});
router.post("/afterSigningUp", (req, res) => {
  if (req.body.setpassword != req.body.confirmpassword) {
    res.render("signup", {
      err_mess: "The password and confirm password fields must be identical.",
    });
    return;
  }
  const uId = uid();
  const values = [
    uId,
    req.body.firstname,
    req.body.lastname,
    req.body.email,
    req.body.phoneNo,
    req.body.setpassword,
  ];
  let sql = `INSERT INTO users (uId,fName,lName,uEmail,uPhone,uPassword) VALUES(?,?,?,?,?,?)`;

  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(sql, values, (err, result) => {
      if (err) {
        res.send(err);
      }
    });
    connection.query("SELECT fName,uId FROM users", (err, result) => {
      if (err) throw err;
      res.send(result);
      // Release the connection back to the pool
      connection.release();
    });
  });
});
router.get("/employees", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query("SELECT fName FROM users", (err, result) => {
      if (err) throw err;
      res.render("employees", { emp: result });
      connection.release();
    });
  });
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
