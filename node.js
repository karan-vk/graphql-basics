const express = require("express");
const bodyParser = require("body-parser");
const { graphqlExpress } = require("apollo-server-express");

const myGraphQLSchema = `
type User{
    name:String!
}`;
const PORT = 5000;

const app = express();

app.use(
    "/graphql",
    bodyParser.json(),
    graphqlExpress({ schema: myGraphQLSchema })
);

app.get("/hello", bodyParser.json(), (req, res) => res.json("hello"));

app.listen(PORT, () => console.log("object"));