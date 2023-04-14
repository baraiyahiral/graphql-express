const graphql = require("graphql");
const { GraphQLObjectType, GraphQLString, GraphQLNonNull } = graphql;

const UserType = new GraphQLObjectType({
  name: "User",
  fields: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
    },
    id: {
      type: GraphQLString,
    },
  },
});

module.exports = UserType;
