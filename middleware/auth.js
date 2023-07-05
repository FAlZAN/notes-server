// third-part import
const jwt = require("jsonwebtoken");

const verifyToken = async (request, response, next) => {
  const token =
    request.body.token ||
    request.query.token ||
    request.headers["x-access-token"];

  if (!token) {
    return response
      .status(403)
      .json({ error: "an authentication token is required." });
  }

  try {
    // decoded token returns user id provided when token sign(creating token)
    const decodedToken = jwt.verify(token, "veryverysecret");
    request.userId = decodedToken._id;
  } catch (error) {
    return response.status(401).json({ error: "invalid token provided." });
  }

  return next();
};

// const requireAuth = async (request, response, next) => {
//   const db = await getDB();
//   const { authorization } = request.headers;

//   if (!authorization) {
//     return response
//       .status(401)
//       .json({ error: "Authorization token required." });
//   }

//   //extract token from authorization
//   const token = authorization.split(" ")[1];

//   try {
//     const { _id } = jwt.verify(token, "veryverysecret");

//     const user = await db
//       .collection("users")
//       .find({ _id: new ObjectId(_id) })
//       .toArray();

//     if (user.length === 0) {
//       return response.status(400).json({ error: "no user found" });
//     }

//     next();
//   } catch (error) {
//     console.log(error);
//     response.status(401).json({ error: "Request is not authorized." });
//   }
// };

module.exports = verifyToken;
