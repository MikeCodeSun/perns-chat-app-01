const { UserInputError } = require("apollo-server");
const { Message, User } = require("../../models/index");
const auth = require("../../utils/auth");
const { Op } = require("sequelize");
const { PubSub, withFilter } = require("graphql-subscriptions");
const pubsub = new PubSub();

module.exports = {
  Query: {},
  Mutation: {
    // send message
    sendMessage: async (_, args, context) => {
      const user = auth(context);
      const { content, to } = args.input;
      const errors = {};
      try {
        // check content not emptu
        if (content.trim() === "") {
          errors.message = "message contten must not be empty";
          throw errors;
        }
        // check to user exist?
        const toUser = await User.findOne({
          where: { name: to },
        });
        if (!toUser) {
          errors.to = "send to user not exist";
          throw errors;
        }
        // check not send to user self
        if (user.name === toUser.name) {
          errors.to = "cant send message to yourself";
          throw errors;
        }
        // create send message
        const message = await Message.create({
          content,
          from: user.name,
          to: toUser.name,
        });

        pubsub.publish("NEW_MESSAGE", { newMessage: message });

        return message;
      } catch (error) {
        console.log(error);
        throw new UserInputError("Error", { errors });
      }
    },
    // get messages
    getMessages: async (_, args, context) => {
      const user = auth(context);
      const { to } = args;
      const errors = {};
      try {
        // find to user
        const toUser = await User.findOne({
          where: { name: to },
        });
        if (!toUser) {
          errors.to = "No to User";
          throw errors;
        }
        // get message from user to touser, and from toUser to user
        const usernames = [user.name, toUser.name];
        const messages = await Message.findAll({
          where: {
            from: { [Op.or]: usernames },
            to: { [Op.or]: usernames },
          },
          order: [["createdAt", "DESC"]],
        });
        return messages;
      } catch (error) {
        console.log(error);
        throw new UserInputError("Error", { errors });
      }
    },
  },
  Subscription: {
    newMessage: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("NEW_MESSAGE"),
        // a is payload have newMe
        ({ newMessage }, b, context) => {
          const user = auth(context);
          console.log(newMessage.from);
          console.log("b");
          console.log(b);
          console.log("user");
          console.log(user);
          if (user) {
            return true;
          } else {
            return false;
          }
        }
      ),
    },
  },
};
