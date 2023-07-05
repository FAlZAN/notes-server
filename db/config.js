// third-party import
require("dotenv").config();
const { MongoClient } = require("mongodb");
const MONGO_URI = process.env.CONN_STRING;

const client = new MongoClient(MONGO_URI, { useNewUrlParser: true });
let db;
async function connToDB() {
  try {
    await client.connect();
    db = client.db("notes");
    console.log("connected to database successfully.");
  } catch (error) {
    console.log(error);
    throw new error(error);
  }
}

async function getDB() {
  return db;
}

async function closeDB() {
  return client.close();
}

module.exports = { connToDB, getDB, closeDB };
