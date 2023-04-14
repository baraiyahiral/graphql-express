const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLSchema,
  GraphQLNonNull,
  GraphQLList,
} = graphql;
const mongoose = require("mongoose");
const lyric = mongoose.model("lyric");
const Song = mongoose.model("song");

const LyricType = new GraphQLObjectType({
  name: "Lyrics",
  fields: () => ({
    id: { type: GraphQLString },
    content: { type: GraphQLString },
    likes: { type: GraphQLInt },
    song: {
      type: SongType,
      resolve(parentValue, args) {
        return lyric
          .findById(parentValue)
          .populate("song")
          .then((lyric) => {
            return lyric.song;
          });
      },
    },
  }),
});

const SongType = new GraphQLObjectType({
  name: "Song",
  fields: () => ({
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    lyrics: {
      type: new GraphQLList(LyricType),
      resolve(parentValue, args) {
        return Song.findLyrics(parentValue.id);
      },
    },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    songs: {
      type: new GraphQLList(SongType),
      resolve(parentValue, args) {
        return Song.find({});
      },
    },
    song: {
      type: SongType,
      args: { id: { type: new GraphQLNonNull(GraphQLString) } },
      resolve(parentValue, { id }) {
        return Song.findOne({ _id: id });
      },
    },
    lyric: {
      type: LyricType,
      args: { id: { type: new GraphQLNonNull(GraphQLString) } },
      resolve(parentValue, args) {
        return Lyric.findById(id);
      },
    },
  },
});

const mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addSong: {
      type: SongType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, { title }) {
        return new Song({ title }).save();
      },
    },
    addLyricToSong: {
      type: SongType,
      args: {
        content: { type: new GraphQLNonNull(GraphQLString) },
        songId: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, { songId, content }) {
        return Song.addLyric(songId, content);
      },
    },
    likeLyric: {
      type: LyricType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, { id }) {
        return lyric.like(id);
      },
    },
    deleteSong: {
      type: SongType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parentValue, { id }) {
        return Song.deleteOne({
          _id: id,
        });
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQueryType,
  mutation,
});
