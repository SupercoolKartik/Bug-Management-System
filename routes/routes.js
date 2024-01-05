import express from "express";
import fs from "fs/promises";
import pool from "../pool.mjs";
import ejs from "ejs";
import { uid } from "uid";

const router = express.Router();

router.get("/main", (req, res) => {
  res.render("main");
});

//// Users Related Routes
router.get("/", (req, res) => {
  res.render("login", { err_mess: "" });
});

router.post("/afterLogin", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;

    connection.query(
      `UPDATE usersId SET id = ? WHERE flag='true'`,
      req.body.uId,
      (err, result) => {
        if (err) throw err;
      }
    );

    connection.query(`SELECT id from usersId`, (err, resultId) => {
      if (err) throw err;
      console.log("The updated usersId", resultId);
    });

    connection.query("SELECT uId,uPassword FROM users", (err, result) => {
      if (err) throw err;

      result.forEach((e) => {
        if (req.body.uId == e.uId) {
          if (req.body.password == e.uPassword) {
            res.render("main");
            connection.release();
            return;
          }
        }
      });

      connection.release();
      return res.render("login", { err_mess: "Invalid User ID or Password" });
    });
  });
});

router.get("/signup", (req, res) => {
  res.render("signup", { err_mess: "" });
});

router.post("/afterSigningUp", (req, res) => {
  if (req.body.setpassword !== req.body.confirmpassword) {
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

  pool.getConnection((err, connection) => {
    if (err) throw err;

    connection.query(
      `INSERT INTO users (uId,fName,lName,uEmail,uPhone,uPassword) VALUES(?,?,?,?,?,?)`,
      values,
      (err, result) => {
        if (err) {
          res.send(err);
        }
      }
    );

    res.render("welcome", { userId: uId });
    connection.release();
  });
});

router.get("/employees", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;

    connection.query("SELECT fName,uId FROM users", (err, result) => {
      if (err) throw err;
      console.log(result);
      res.render("employees", { emp: result });
      connection.release();
    });
  });
});

router.get("/employee", (req, res) => {
  console.log(req.query);
  const userId = req.query.uId;
  pool.getConnection((err, connection) => {
    if (err) throw err;

    connection.query(
      `SELECT * FROM users WHERE uId = ?`,
      userId,
      (err, result) => {
        if (err) throw err;

        res.render("employee", { usersData: result });
        connection.release();
      }
    );
  });
});

//// Projects Related Routes
router.get("/projects", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;

    connection.query(`SELECT id from usersId`, (err, resultUid) => {
      if (err) throw err;
      const uIdCurr = resultUid[0].id;

      connection.query(
        `SELECT pId, pName FROM users_projects WHERE uId = ?`,
        uIdCurr,
        (err, result) => {
          if (err) throw err;

          res.render("projects", { projects: result });
          connection.release();
          return;
        }
      );
    });
  });
});

router.get("/create_project", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;

    connection.query("SELECT uId,fName FROM users", (err, result) => {
      if (err) throw err;

      res.render("create_project", { employees: result });
      connection.release();
    });
  });
});

router.post("/afterProjectCreation", (req, res) => {
  const emp = req.body.selectedEmployees || [];
  const project_name = req.body.proj_name || [];

  pool.getConnection((err, connection) => {
    if (err) throw err;

    const projectId = uid(6);

    connection.query(`SELECT id from usersId`, (err, resultUid) => {
      if (err) throw err;
      const uIdCurr = resultUid[0].id;

      const valuesP = [projectId, project_name, uIdCurr];
      connection.query(
        `INSERT INTO projects (pId,pName,uIdCb) VALUES(?,?,?)`,
        valuesP,
        (err, result) => {
          if (err) {
            connection.release();
            res.status(500).send(err.message);
            return;
          }

          const sqlUp = `INSERT INTO users_projects (id,uId,pId,pName) VALUES(?,?,?,?)`;

          emp.forEach((emp_name) => {
            const userProjectId = uid(4);
            const valuesUp = [userProjectId, emp_name, projectId, project_name];
            connection.query(sqlUp, valuesUp, (err, result) => {
              if (err) {
                res.status(500).send(err.message);
                return;
              }
            });
          });
        }
      );

      connection.release();
      return res.redirect("/projects");
    });
  });
});

router.get("/project", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }
    const projectId = req.query.pId;
    connection.query(
      `SELECT pId,uIdCb,pName FROM projects WHERE pId = ?`,
      projectId,
      (err, resultP) => {
        if (err) throw err;
        connection.query(
          `SELECT uId FROM users_projects WHERE pId = ?`,
          projectId,
          (err, resultU) => {
            if (err) throw err;
            connection.query(
              `SELECT tId FROM tickets WHERE pId = ?`,
              projectId,
              (err, resultT) => {
                if (err) throw err;
                res.render("project", {
                  projectData: resultP[0],
                  usersData: resultU,
                  ticketsData: resultT,
                });
                connection.release();
              }
            );
          }
        );
      }
    );
  });
});

//// Tickets Related Routes
router.get("/tickets", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;

    connection.query(`SELECT id from usersId`, (err, resultUid) => {
      if (err) throw err;
      const uIdCurr = resultUid[0].id;

      connection.query(
        `SELECT tId, uIdCf, uIdCb, description FROM tickets WHERE uIdCb = ?`,
        uIdCurr,
        (err, resultCb) => {
          if (err) throw err;

          connection.query(
            `SELECT tId, uIdCf, uIdCb, description FROM tickets WHERE uIdCf = ?`,
            uIdCurr,
            (err, resultCf) => {
              if (err) throw err;

              res.render("tickets", { tby: resultCb, tfy: resultCf });
              connection.release();
            }
          );
        }
      );
    });
  });
});
router.get("/selectProject", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;

    connection.query(`SELECT id from usersId`, (err, resultUid) => {
      if (err) throw err;

      const uIdCurr = resultUid[0].id;

      connection.query(
        `SELECT pId, pName FROM users_projects WHERE uId = ?`,
        uIdCurr,
        (err, result) => {
          if (err) throw err;

          res.render("selectProjectForTc", { projects: result });
          connection.release();
        }
      );
    });
  });
});
router.post("/create_ticket", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;

    connection.query(
      `SELECT uId FROM users_projects WHERE pId = ?`,
      req.body.selectedProject,
      (err, userIds) => {
        if (err) throw err;

        res.render("create_ticket", {
          users: userIds,
          projectValue: req.body.selectedProject,
        });
        connection.release();
      }
    );
  });
});

router.post("/afterCreatingTicket", (req, res) => {
  const tId = uid(5);

  pool.getConnection((err, connection) => {
    if (err) throw err;

    connection.query(`SELECT id from usersId`, (err, resultUid) => {
      if (err) throw err;
      const uIdCurr = resultUid[0].id;

      const values = [
        tId,
        req.body.project,
        uIdCurr,
        req.body.selectedUserId,
        req.body.description,
      ];

      connection.query(
        `INSERT INTO tickets (tId,pId,uIdCb,uIdCf,description) VALUES(?,?,?,?,?)`,
        values,
        (err, result) => {
          if (err) throw err;

          res.redirect("./tickets");
          connection.release();
        }
      );
    });
  });
});

router.get("/ticket", (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;

    connection.query(
      `SELECT * FROM tickets WHERE tId = ?`,
      req.query.tId,
      (err, result) => {
        if (err) throw err;

        res.render("ticket", { ticketData: result[0] });
        connection.release();
      }
    );
  });
});

export default router;
