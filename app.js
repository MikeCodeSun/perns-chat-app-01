const { ApolloServer } = require("apollo-server");
require("dotenv").config();
const typeDefs = require("./graphql/type-defs");
const resolvers = require("./graphql/resolvers");

// .env varible
const port = process.env.PORT;
// create new apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req }),
});
// connect to apollo server
server.listen(port).then(({ url }) => {
  console.log(`server is listening on URL : ${url}`);
});
