const { UserInputError } = require("apollo-server");
const bcrypt = require("bcryptjs");
const { User, Message } = require("../../models/index");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { Op } = require("sequelize");
const auth = require("../../utils/auth");

module.exports = {
  Mutation: {
    // register user
    register: async (_, args) => {
      const { name, email, password } = args.input;
      const errors = {};

      try {
        // check user input name & email & password more 6 not empty
        if (name.trim() === "") errors.name = "name must not be empty";
        if (email.trim() === "") errors.email = "email must not be empty";
        if ([...password].length < 6)
          errors.password = "password must not be more than 6";
        if (Object.keys(errors).length > 0) {
          throw errors;
        }

        // check user name&email exist? change to model validate
        // const userName = await User.findOne({
        //   where: { name },
        // });
        // const userEmail = await User.findOne({
        //   where: { email },
        // });
        // if (userName) errors.name = "name already taken";
        // if (userEmail) errors.email = "email already taken";
        // if (Object.keys(errors).length > 0) {
        //   throw new UserInputError("User input Error", { errors });
        // }

        // hash password
        const hashPassword = await bcrypt.hash(password, 10);
        // insert user into db
        const user = await User.create({
          name,
          email,
          password: hashPassword,
        });
        // console.log(user);
        // return graphql
        return user;
      } catch (error) {
        console.log(error);
        // get not unique email / name errir from model validate
        // get not valid email addres error from mode validate
        if (error.name === "SequelizeUniqueConstraintError") {
          error.errors.forEach((e) => {
            errors[e.path] = e.message;
          });
        }
        if (error.name === "SequelizeValidationError") {
          error.errors.forEach((e) => {
            errors[e.path] = e.message;
          });
        }
        throw new UserInputError("Error", { errors });
      }
    },
    // login user
    login: async (_, args) => {
      const { name, password } = args.input;
      const errors = {};
      try {
        // check user login input name not empty, password not null
        if (name.trim() === "") errors.name = "name must not be empty";
        if (!password) errors.password = "password not be null";
        if (Object.keys(errors).length > 0) {
          throw errors;
        }
        // check user exist?
        const existUser = await User.findOne({
          where: {
            name,
          },
        });
        if (!existUser) {
          errors.name = "User not exist";
          throw errors;
        }
        // console.log({ ...existUser.toJson() });
        // check password is match
        const valid = await bcrypt.compare(password, existUser.password);
        if (!valid) {
          errors.password = "passwor not right";
          throw errors;
        }
        // generate jwt token
        const token = jwt.sign({ name }, process.env.SECRET, {
          expiresIn: "1d",
        });
        // return user.toJSON()
        return {
          ...existUser.toJSON(),
          token,
        };
      } catch (error) {
        console.log(error);
        throw new UserInputError("Error", { errors });
      }
    },
  },
  Query: {
    getUsers: async (_, __, context) => {
      const user = auth(context);

      try {
        // get all users (except login user)
        let users = await User.findAll({
          attributes: ["name", "uuid"],
          where: { name: { [Op.ne]: user.name } },
        });
        // get all message from / to user
        const allMessages = await Message.findAll({
          where: {
            [Op.or]: [{ from: user.name }, { to: user.name }],
          },
          order: [["createdAt", "DESC"]],
        });
        // find last from/to message to  user
        users = users.map((user) => {
          const lastMessage = allMessages.find(
            (m) => m.to === user.name || m.from === user.name
          );
          user.lastMessage = lastMessage;
          return user;
        });

        return users;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
  },
};
