const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLNonNull } = graphql;
const UserType = require("./userType");
const Auth = require("../services/SignUp");

const mutation = new GraphQLObjectType({
  name: "mutation",
  fields: {
    signUp: {
      type: UserType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, { email, password }, req) {
        return Auth.signUp({ email, password, req });
      },
    },
    logOut: {
      type: UserType,
      resolve(parentValue, args, req) {
        const { user } = req;
        req.logOut();
        return user;
      },
    },
    logIn: {
      type: UserType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, { email, password }, req) {
        return Auth.logIn({ email, password, req });
      },
    },
  },
});

module.exports = mutation;
