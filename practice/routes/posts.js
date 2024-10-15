const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  console.log(router);

  res.send("Get for posts");
});

router.get("/:id", (req, res) => {
  res.send("Get for post id");
  console.log(router);
});

router.post("/", (req, res) => {
  res.send("POST for posts");
});

router.put("/:id", (req, res) => {
  res.send("PUT for post id");
  console.log(router);
});
router.delete("/", (req, res) => {
  res.send("delete for post");
});

module.exports = router;
