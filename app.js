// const { ApolloServer } = require("apollo-server");
require("dotenv").config();
const typeDefs = require("./graphql/type-defs");
const resolvers = require("./graphql/resolvers");
const { sequelize } = require("./models/index");
// // .env varible
const port = process.env.PORT;

// // create new apollo server
// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   context: ({ req }) => ({ req }),
// });
// // connect to apollo server
// server.listen(port).then(({ url }) => {
//   console.log(`server is listening on URL : ${url}`);
// });

// change to apollo express server to use subscription
const { ApolloServer } = require("apollo-server-express");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const express = require("express");
const http = require("http");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws");

const startApolloServer = async (typeDefs, resolvers) => {
  // epxress app
  const app = express();
  // create server
  const httpServer = http.createServer(app);
  // bind schema
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  // create ws server
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });
  // use server
  const serverCleanup = useServer(
    {
      schema,
      onConnect: () => {
        console.log("connect");
      },
      context: (ctx) => {
        // console.log("1.5");
        // console.log({ ctx });
        return { ctx };
      },
      onDisconnect() {
        console.log("Disconnected!");
      },
    },
    wsServer
  );
  // create apollo server
  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      return { req };
    },
    // subscriptions: {
    //   onConnect: async (connectionParams, WebSocket) => {
    //     console.log(connectionParams);
    //     return connectionParams;
    //   },
    // },
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  // server start
  await server.start();
  server.applyMiddleware({
    app,
    http: "/",
  });

  await new Promise((resolve) => httpServer.listen({ port }, resolve));
  console.log(`server is on Port: ${port}`);
  sequelize
    .authenticate()
    .then(() => console.log("db connected"))
    .catch((err) => console.log(err));
};

startApolloServer(typeDefs, resolvers);
