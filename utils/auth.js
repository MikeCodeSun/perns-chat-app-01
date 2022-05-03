const { AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
require("dotenv").config();
module.exports = (context) => {
  if (!context.req || !context.req.headers.authorization) {
    throw new AuthenticationError("No Auth Token");
  }
  const token = context.req.headers.authorization.split(" ")[1];

  try {
    const user = jwt.verify(token, process.env.SECRET);
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
