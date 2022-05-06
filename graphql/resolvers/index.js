const user = require("./user");
const message = require("./message");
const { Message, User } = require("../../models/index");

// resolver root index
module.exports = {
  User: {
    createdAt: (parent) => parent.createdAt.toISOString(),
  },
  Message: {
    createdAt: (parent) => parent.createdAt.toISOString(),
  },
  Reaction: {
    message: async (parent) =>
      await Message.findOne({ where: { id: parent.messageId } }),
    user: async (parent) =>
      await User.findOne({ where: { id: parent.userId } }),
  },
  Query: {
    ...user.Query,
    ...message.Query,
  },
  Mutation: {
    ...user.Mutation,
    ...message.Mutation,
  },
  Subscription: {
    ...message.Subscription,
  },
};
