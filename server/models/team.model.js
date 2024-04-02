const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const teamSchema = new Schema({
  userCount: { type: Number, required: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, {
  timestamps: true,
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
