const express = require("express");
const model = require("./models");
const passport = require("passport");
const passportConfig = require("./services/SignUp");
const session = require("express-session");
const expressGraphQL = require("express-graphql").graphqlHTTP;
const mongoose = require("mongoose");
const cors = require("cors");
const MongoStore = require("connect-mongo")(session);
const mutation = require("./schema/mutations");
const { GraphQLSchema } = require("graphql");
const query = require("./schema/queries");

const app = express();
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, // <-- REQUIRED backend setting
};
app.use(cors(corsOptions));

const MONGO_URI =
  "mongodb+srv://hiralbaraiya:Hiral123@lyricalcluster.vxinjn2.mongodb.net/?retryWrites=true&w=majority";

mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URI);
mongoose.connection
  .once("open", () => console.log("Connected to Mongolab"))
  .on("error", (error) => console.log("Error connecting to MongoLab:", error));

app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "aaabbbccc",
    store: new MongoStore({
      url: MONGO_URI,
      autoReconnect: true,
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

const schema = new GraphQLSchema({
  mutation,
  query,
});

app.use(
  "/graphql",
  expressGraphQL({
    schema,
    graphiql: true, //only for development mode
  })
);

app.listen(4000, () => {
  console.log("listening");
});
