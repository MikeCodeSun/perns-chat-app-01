const user = require("./user");
const message = require("./message");

// resolver root index
module.exports = {
  User: {
    createdAt: (parent) => parent.createdAt.toISOString(),
  },
  Message: {
    createdAt: (parent) => parent.createdAt.toISOString(),
  },
  Query: {
    ...user.Query,
    ...message.Query,
  },
  Mutation: {
    ...user.Mutation,
    ...message.Mutation,
  },
};
