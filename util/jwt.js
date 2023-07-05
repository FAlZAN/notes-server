const jwt = require("jsonwebtoken");

async function generateToken(_id) {
  return await jwt.sign({ _id }, "veryverysecret");
}

module.exports = { generateToken };
