const { ApolloServer, gql } = require("apollo-server-express");
import { importSchema } from "graphql-import";
import { makeExecutableSchema } from "graphql-tools";
const express = require("express");
import bodyParser from "body-parser";
import { SubscriptionServer } from "subscriptions-transport-ws";
import { execute, subscribe } from "graphql";
import { createServer } from "http";
const { PubSub } = require("apollo-server");
const pubsub = new PubSub();
import db from "./db";
import Query from "./resolvers/Query";
import Post from "./resolvers/Post";
import Comment from "./resolvers/Comment";
import Mutation from "./resolvers/Mutation";
import User from "./resolvers/User";
import Subscription from "./resolvers/Subscription";
const app = express();
app.get("/hello", (req, res) => res.json("hello"));
// app.use("/graphql", bodyParser.json());
const apolloServer = new ApolloServer({
    typeDefs: importSchema("./src/schema.graphql"),

    resolvers: {
        Query,
        Post,
        Comment,
        Mutation,
        User,
        Subscription,
    },
    tracing: true,
    context: {
        pubsub,
        db,
    },

    subscriptions: { path: "/subscriptions" },
});
apolloServer.applyMiddleware({ app, path: "/app" });
const server = createServer(app);

server.listen(3000, () => {
    console.log(apolloServer.subscriptionsPath);
    new SubscriptionServer({
        execute,
        subscribe,
        onOperation: (message, params, webSocket) => {
            return {...params, context: { pubsub, db } };
        },
        schema: makeExecutableSchema({
            typeDefs: importSchema("./src/schema.graphql"),
            resolvers: {
                Query,
                Post,
                Comment,
                Mutation,
                User,
                Subscription,
            },
        }),
    }, {
        server: server,
        path: "/subscriptions",
    });
});