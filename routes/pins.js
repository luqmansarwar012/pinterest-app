// models/pin.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pinSchema = new Schema({
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    description: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

const Pin = mongoose.model('Pin', pinSchema);

module.exports = Pin;
