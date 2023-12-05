import { db } from "../connection/db.js";

const tableName = "application_passwords";

const getallpasswords = (req, res) => {
  let id = req.params.admin_id;
  let listAllPasswordSQL = `SELECT * FROM ${tableName} WHERE admin_id = ?`;

  db.query(listAllPasswordSQL, id, (err, result) => {
    if (err)
      return res.status(400).send({
        status: 400,
        message: "error getting list of passwords",
        error: err,
      });

    if (result.length === 0)
      return res
        .status(400)
        .send({ status: 400, message: "No passwords here" });
    return res.status(200).send({ status: 200, message: "OK", data: result });
  });
};

const addnewpassword = (req, res, next) => {
  try {
    let payload = {
      admin_id: req.body.admin_id,
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      password: btoa(req.body.password),
      security_question: req.body.security_question,
      security_answer: req.body.security_answer,
      app_name: req.body.app_name,
    };

    let addPasswordSQL = `INSERT INTO ${tableName} SET ?`;

    db.query(addPasswordSQL, payload, (err) => {
      if (err)
        return res
          .status(400)
          .send({ status: 400, message: "error adding the password" });

      return res
        .status(200)
        .send({ status: 200, message: "Added the password successfully!" });
    });
  } catch (error) {
    console.log(
      "🚀 ~ file: passwordManager.controller.js:14 ~ addnewpassword ~ error:",
      error
    );
    next(error);
  }
};

const editPassword = (req, res, next) => {
  try {
    let passwordId = req.params.app_id;

    let payload = {
      admin_id: req.body.admin_id,
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      security_question: req.body.security_question,
      security_answer: req.body.security_answer,
      app_name: req.body.app_name,
    };

    let editPasswordSQL = `UPDATE ${tableName} SET ? WHERE app_id = ?`;

    db.query(editPasswordSQL, [payload, passwordId], (err, results) => {
      if (err) {
        console.error("Error updating password:", err);
        return res
          .status(400)
          .send({ status: 400, message: "Error updating the password" });
      }

      if (results.affectedRows === 0) {
        return res.status(404).send({
          status: 404,
          message: "Password not found for the provided ID",
        });
      }

      return res
        .status(200)
        .send({ status: 200, message: "Password updated successfully!" });
    });
  } catch (error) {
    console.log(
      "🚀 ~ file: passwordManager.controller.js:14 ~ editPassword ~ error:",
      error
    );
    next(error);
  }
};

const deletePassword = (req, res, next) => {
  try {
    let id = req.params.app_id;

    let deleteSQL = `DELETE FROM ${tableName} WHERE app_id = ?`;

    db.query(deleteSQL, id, (err) => {
      if (err)
        return res
          .status(400)
          .send({ status: 400, message: "error deleting the app" });

      return res.status(200).send({ status: 200, message: "DELETED" });
    });
  } catch (error) {
    console.log(
      "🚀 ~ file: passwordManager.controller.js:109 ~ deletePassword ~ error:",
      error
    );
    next(error);
  }
};

export { getallpasswords, addnewpassword, editPassword, deletePassword };
