// models/user.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const plm = require('passport-local-mongoose')
const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  posts:[{type:mongoose.Schema.Types.ObjectId,
  ref:'Pin'}],
  dp:{type:String},
  fullname:{type:String,required:true}
});

userSchema.plugin(plm)
module.exports = mongoose.model('User', userSchema);
