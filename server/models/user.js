const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  id: { type: Number, unique: true, required: true },
  first_name: { type: String, required: true }, 
  last_name: { type: String, required: true }, 
  email: { type: String, required: true },
  gender: { type: String, required: true },
  avatar: { type: String, required: false }, 
  domain: { type: String, required: true },
  available: { type: Boolean, required: true },
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
