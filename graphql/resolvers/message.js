const { UserInputError } = require("apollo-server");
const { Message, User, Reaction } = require("../../models/index");
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
          include: [{ model: Reaction, as: "reactions" }],
        });
        return messages;
      } catch (error) {
        console.log(error);
        throw new UserInputError("Error", { errors });
      }
    },
    // add reaction to message
    addReaction: async (_, args, context) => {
      const user = auth(context);
      const { messageId, content } = args.input;
      const reactions = ["👌", "💪", "👍", "👎", "😃", "😡", "😘"];
      const errors = {};
      // console.log(user);
      try {
        // check content
        if (!reactions.includes(content)) {
          errors.content = "no content";
          throw new UserInputError("Error", { errors });
        }
        // check user
        const userReact = await User.findOne({
          where: { name: user.name },
        });
        if (!userReact) {
          errors.user = "no user";
          throw new UserInputError("Error", { errors });
        }
        // console.log(userReact);
        // check message
        const messageReact = await Message.findOne({
          where: { uuid: messageId },
          include: "reactions",
        });
        // console.log(messageReact);
        if (!messageReact) {
          errors.user = "no message";
          throw new UserInputError("Error", { errors });
        }
        if (messageReact.to !== user.name && messageReact.from !== user.name) {
          errors.user = "not your message";
          throw new UserInputError("Error", { errors });
        }
        //check reaction
        // let reaction = messageReact.reactions.find(
        //   (r) => r.userId === user.uuid
        // );
        let reaction = await Reaction.findOne({
          where: { userId: userReact.id, messageId: messageReact.id },
        });
        // console.log(reaction);
        if (reaction) {
          reaction.content = content;
          await reaction.save();
        } else {
          reaction = await Reaction.create({
            content,
            messageId: messageReact.id,
            userId: userReact.id,
          });
        }
        pubsub.publish("NEW_REACTION", { newReaction: reaction });
        return reaction;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
  Subscription: {
    // new message sub
    newMessage: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("NEW_MESSAGE"),
        // a is payload have newMessage,
        ({ newMessage }, _, context) => {
          const user = auth(context);

          // console.log(newMessage);
          if (newMessage.from === user.name || newMessage.to === user.name) {
            return true;
          } else {
            return false;
          }
        }
      ),
    },
    // new reaction sub
    newReaction: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("NEW_REACTION"),
        async ({ newReaction }, _, content) => {
          const user = auth(content);
          const message = await newReaction.getMessage();
          console.log("filter");
          // console.log(message);
          if (message.from === user.name || message.to === user.name) {
            return true;
          }
          return false;
        }
      ),
    },
  },
};
