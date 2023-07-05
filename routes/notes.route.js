const express = require("express");
const router = express.Router();
const {
  createNewNote,
  getNotes,
  deleteANote,
  updateANote,
} = require("../controller/notes.controller.js");
const auth = require("../middleware/auth.js");

router.use(auth);

router.post("/", createNewNote);
router.get("/:id", getNotes);
router.delete("/:id", deleteANote);
router.patch("/:id", updateANote);

module.exports = router;
