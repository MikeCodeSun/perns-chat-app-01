import { gql } from "@apollo/client";

export const LOGIN = gql`
  mutation Login($input: loginInput!) {
    login(input: $input) {
      uuid
      name
      email
      token
      createdAt
    }
  }
`;
export const REGISTER = gql`
  mutation Register($input: registerInput!) {
    register(input: $input) {
      uuid
      name
      email
      token
      createdAt
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    getUsers {
      uuid
      name
      lastMessage {
        uuid
        content
        createdAt
        from
        to
      }
    }
  }
`;

export const GET_MESSAGES = gql`
  mutation GetMessages($to: String!) {
    getMessages(to: $to) {
      uuid
      content
      from
      to
      createdAt
      reactions {
        uuid
        content
        messageId
        userId
      }
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($input: sendMessageInput!) {
    sendMessage(input: $input) {
      uuid
      from
      to
      content
      createdAt
      reactions {
        uuid
        content
        messageId
        userId
      }
    }
  }
`;

export const NEW_MESSAGE = gql`
  subscription NewMessage {
    newMessage {
      uuid
      content
      from
      to
      createdAt
      reactions {
        uuid
        content
        messageId
        userId
      }
    }
  }
`;

export const ADD_REACTION = gql`
  mutation AddReaction($input: addReactionInput!) {
    addReaction(input: $input) {
      uuid
      content
    }
  }
`;

export const NEW_REACTION = gql`
  subscription NewReaction {
    newReaction {
      uuid
      content
      messageId
      userId
      createdAt
      message {
        uuid
        from
        to
      }
      user {
        name
      }
    }
  }
`;
