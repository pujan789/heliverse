const Team = require('../models/team.model');
const User = require('../models/user');

const createTeam = async (req, res) => {
  const { userIds } = req.body; 

  try {
    const users = await User.find({ id: { $in: userIds }, available: true });

    if (users.length !== userIds.length) {
      return res.status(400).json({ message: "One or more users are not available or do not exist." });
    }

    // Check for unique domains
    const domains = users.map(user => user.domain);
    const uniqueDomains = new Set(domains);
    if (uniqueDomains.size !== domains.length) {
      // Identifying users with duplicate domains
      let duplicateDomainUsers = users.filter((user, index) => domains.indexOf(user.domain) !== index);
      let duplicateNames = duplicateDomainUsers.map(user => `${user.first_name} ${user.last_name}`);
      return res.status(400).json({ message: `Multiple users have the same domain: ${duplicateNames.join(", ")}.` });
    }

    const team = new Team({
      userCount: users.length,
      users: users.map(user => user._id), 
    });
    await team.save();

    // Update the availability of users in the team to false
    await User.updateMany({ id: { $in: userIds } }, { $set: { available: false } });

    res.status(201).json(team);
  } catch (error) {
    console.error("Error creating team:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate('users');
    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }
    res.json({ userCount: team.userCount, users: team.users });
  } catch (error) {
    console.error("Error retrieving team:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createTeam, getTeamById };
