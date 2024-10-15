const { required } = require("joi");
const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  email: {
    type: String,
  },
  // username: {
  //   type: String,
  //   required: true,
  // },

  // password: {
  //   type: String,
  //   required: true,
  // },
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);
module.exports = User;
