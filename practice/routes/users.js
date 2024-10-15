const express = require("express");
const router = express.Router();

router.get("/users", (req, res) => {
  res.send("Get for users");
});

router.get("/users/:id", (req, res) => {
  res.send("Get for user id");
});

router.post("/users", (req, res) => {
  res.send("POST for users");
});

router.put("/users/:id", (req, res) => {
  res.send("PUT for user id");
});
router.delete("/users", (req, res) => {
  res.send("delete for users");
});

module.exports = router;
