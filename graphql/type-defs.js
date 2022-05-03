const { gql } = require("apollo-server");
// create gql type, mutation, query,
module.exports = gql`
  type User {
    uuid: String!
    name: String!
    email: String!
    token: String
    createdAt: String
    lastMessage: Message
  }
  type Message {
    uuid: String!
    content: String!
    from: String!
    to: String!
    createdAt: String!
  }
  type Query {
    getUsers: [User]!
  }

  input registerInput {
    name: String!
    email: String!
    password: String!
  }
  input loginInput {
    name: String!
    password: String!
  }

  input sendMessageInput {
    content: String!
    to: String!
  }

  type Mutation {
    register(input: registerInput!): User!
    login(input: loginInput!): User!
    sendMessage(input: sendMessageInput!): Message!
    getMessages(to: String!): [Message]!
  }
`;
