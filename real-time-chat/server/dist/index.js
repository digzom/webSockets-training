"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_yoga_1 = require("graphql-yoga");
const messages = [];
const typeDefs = `
  type Message {
    id: ID!
    user: String!
    content: String!
  }

  type Query {
    messages: [Message!]
  }

  type Mutation {
    postMessage(user: String!, content: String!): ID!
  }
`;
const resolvers = {
    Query: {
        messages: () => messages,
    },
    Mutation: {
        postMessage: (parent, { user, content }) => {
            const id = messages.length;
            messages.push({
                id,
                user,
                content,
            });
            return id;
        },
    },
};
const server = new graphql_yoga_1.GraphQLServer({ typeDefs, resolvers });
server.start(({ port }) => {
    console.log(`Server running on http://localhost:${port}/`);
});
//# sourceMappingURL=index.js.map