// third-party import
const validator = require("validator");
const nodemailer = require("nodemailer");
// db
const { getDB } = require("../db/config.js");
// utils
const { generateOTP } = require("../util/otp.js");
const { hashData, matchData } = require("../util/bcrypt");
const { generateToken } = require("../util/jwt.js");

// authenticating user before logging in
const authenticateUser = async (data) => {
  const { email } = data;

  try {
    const db = await getDB();
    // check if user exists by the provided email
    const user = await db.collection("users").find({ email: email }).toArray();

    if (user.length === 0) {
      return response.status(400).json({ error: "user does not exists." });
    }

    const _id = user[0]._id;

    // authorize jwt token
    const token = await generateToken(_id);

    // updating user document with authorization jwt token
    await db.collection("users").updateOne({ _id }, { $set: { token } });

    const authenticatedUser = await db
      .collection("users")
      .find({ email })
      .toArray();

    return authenticatedUser;
  } catch (error) {
    throw error;
  }
};

const createNewUser = async (request, response) => {
  const db = await getDB();
  const { firstName, lastName, email } = request.body;

  if (!firstName || !lastName || !email) {
    response.status(400).json({ error: "all fields are required." });
    return;
  }

  if (!validator.isEmail(email)) {
    response.status(400).json({ error: "invalid email provided." });
    return;
  }

  try {
    const doesUserExists = await db
      .collection("users")
      .find({ email: email })
      .toArray();

    if (doesUserExists.length > 0) {
      response
        .status(400)
        .json({ error: "user with the provided email already exists." });
      return;
    }

    const newUser = await db.collection("users").insertOne({
      firstName,
      lastName,
      email,
      token: null,
      otp: null,
      createdAt: new Date().toLocaleString(),
    });

    response.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    response.status(500).json(error);
  }
};

const sendOTP = async (request, response) => {
  const { email } = request.body;
  const db = await getDB();

  if (!email) {
    response.status(400).json({ error: "email is required." });
    return;
  }

  if (!validator.isEmail(email)) {
    response.status(400).json({ error: "invalid email provided." });
    return;
  }

  try {
    const user = await db.collection("users").find({ email }).toArray();

    if (user.length === 0) {
      return response
        .status(400)
        .json({ error: "user does not exists with the provided email." });
    }

    // generating otp with the helper function above
    const otp = generateOTP(6);
    const hashedOtp = await hashData(otp);

    // updating user with new generated otp
    await db
      .collection("users")
      .updateOne({ _id: user[0]._id }, { $set: { otp: hashedOtp } });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    const mail = {
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: "verification code",
      html: `<h1>${otp}</h1>`,
    };

    transporter.sendMail(mail, (error, result) => {
      if (error) {
        return error;
      }
      return result;
    });

    response.status(200).json({ message: "check email to verify otp." });
  } catch (error) {
    response.status(500).json({ error: "something went wrong." });
    return;
  }
};

const verifyOTP = async (request, response) => {
  const { email, otp } = request.body;
  const db = await getDB();

  if (!email) {
    response.status(400).json({ error: "email is required." });
    return;
  }

  if (!otp) {
    response.status(400).json({ error: "otp is required" });
    return;
  }

  if (!validator.isEmail(email)) {
    response.status(400).json({ error: "invalid email provided." });
    return;
  }

  try {
    const user = await db.collection("users").find({ email }).toArray();

    if (user.length === 0) {
      response
        .status(400)
        .json({ error: "user with the provided email does not exists." });
      return;
    }

    const presistedOTP = user[0].otp;

    if (presistedOTP === null) {
      response.status(400).json({ error: "otp expired." });
      return;
    }

    // check if recieved OTP matches with OTP store in database
    const match = await matchData(otp, presistedOTP);

    if (!match) {
      response.status(400).json({ error: "otp does not match." });
      return;
    }

    const authenticatedUser = await authenticateUser(user[0]);

    response.status(200).json({
      _id: authenticatedUser[0]._id,
      email,
      name: authenticatedUser[0].firstName,
      token: authenticatedUser[0].token,
    });
  } catch (error) {
    response.status(500).json({ error: "something went wrong." });
    return;
  }
};

module.exports = { createNewUser, sendOTP, verifyOTP };
