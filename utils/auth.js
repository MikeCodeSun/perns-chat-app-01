const { AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");
require("dotenv").config();
module.exports = (context) => {
  let token;
  if (context.req && context.req.headers.authorization) {
    token = context.req.headers.authorization.split(" ")[1];
  }
  if (context.ctx && context.ctx.connectionParams.Authorization) {
    token = context.ctx.connectionParams.Authorization.split(" ")[1];
  }

  // console.log(context.ctx);
  // console.log("toekn");
  // console.log(token);
  if (!token) {
    throw new AuthenticationError("No authrization token");
  }

  try {
    const user = jwt.verify(token, process.env.SECRET);
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
