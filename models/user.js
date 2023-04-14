const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const User = new Schema({
  email: { type: String },
  password: { type: String },
});

mongoose.model("User", User);
