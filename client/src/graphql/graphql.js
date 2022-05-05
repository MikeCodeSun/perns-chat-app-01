import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { createClient } from "graphql-ws";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";

// http link
let httpLink = createHttpLink({
  uri: "http://localhost:8080/graphql",
});

// auth link
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});
httpLink = authLink.concat(httpLink);
// ws link
const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:8080/graphql",
    on: {
      connected: (socket) => {
        console.log("connect client");
        console.log(socket);
      },
    },
    connectionParams: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
);
// concat httplink & authlink

// split wslink & httplink
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },

  wsLink,
  httpLink
);
// client
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;
