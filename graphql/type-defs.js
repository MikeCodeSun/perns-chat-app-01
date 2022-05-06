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
    reactions: [Reaction]
  }

  type Reaction {
    uuid: String!
    content: String!
    messageId: String!
    userId: String!
    createdAt: String!
    message: Message!
    user: User!
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

  input addReactionInput {
    messageId: String!
    content: String!
  }

  type Mutation {
    register(input: registerInput!): User!
    login(input: loginInput!): User!
    sendMessage(input: sendMessageInput!): Message!
    getMessages(to: String!): [Message]!
    addReaction(input: addReactionInput!): Reaction!
  }

  type Subscription {
    newMessage: Message!
    newReaction: Reaction!
  }
`;
