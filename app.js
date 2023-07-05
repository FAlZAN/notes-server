const express = require("express");
const app = express();
const cors = require("cors");
const notesRoute = require("./routes/notes.route.js");
const usersRoute = require("./routes/users.route.js");

//middleware
app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("/api/notes", notesRoute);
app.use("/api/users", usersRoute);

module.exports = app;
