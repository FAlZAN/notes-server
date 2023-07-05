const express = require("express");
const router = express.Router();
const {
  createNewUser,
  sendOTP,
  verifyOTP,
} = require("../controller/users.controller.js");
// test
const { ObjectId } = require("mongodb");
const { getDB } = require("../db/config.js");

router.post("/signup", createNewUser);
router.post("/login", sendOTP);
router.post("/login/verify", verifyOTP);

router.post("/test", async (req, res) => {
  const { _id } = req.body;
  try {
    const db = await getDB();
    const user = await db
      .collection("users")
      .find({ _id: new ObjectId(_id) })
      .toArray();
    console.log(user);
    res.send("done");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
