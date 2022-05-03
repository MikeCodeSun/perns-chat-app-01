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
    }
  }
`;
