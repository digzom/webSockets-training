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

  type Subscription {
    messages: [Message!]
  }
`;
const subscribers = [];
const onMessagesUpdates = (fn) => subscribers.push(fn);
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
            subscribers.forEach((fn) => fn());
            return id;
        },
    },
    Subscription: {
        messages: {
            subscribe: (parent, args, { pubsub }) => {
                const channel = Math.random().toString(36).slice(2, 15);
                onMessagesUpdates(() => pubsub.publish(channel, { messages }));
                setTimeout(() => () => pubsub.publish(channel, { messages }), 0);
                return pubsub.asyncIteretor(channel);
            },
        },
    },
};
const pubsub = new graphql_yoga_1.PubSub();
const server = new graphql_yoga_1.GraphQLServer({ typeDefs, resolvers });
server.start(({ port }) => {
    console.log(`Server running on http://localhost:${port}/`);
});
//# sourceMappingURL=index.js.map