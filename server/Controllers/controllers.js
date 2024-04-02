const User = require("../models/user");

exports.getAllUsers = async (req, res) => {
  try {
    let { name, domains, genders, available, page } = req.query;
    let pageNumber = page ? parseInt(page, 10) : 1;
    const usersPerPage = 20;
    let query = {};

    if (name) {
      query.$or = [
        { first_name: { $regex: name, $options: "i" } },
        { last_name: { $regex: name, $options: "i" } }
      ];
    }

    
    // Handles domains, genders, and availability as arrays, allowing for multiple selections
    if (domains) query.domain = { $in: domains.split(",").map(domain => domain.trim()) };
    if (genders) query.gender = { $in: genders.split(",").map(gender => gender.trim()) };
    if (available) query.available = { $in: available.split(",").map(avail => avail.trim() === "true") };

    const count = await User.countDocuments(query);
    const users = await User.find(query)
      .skip((pageNumber - 1) * usersPerPage)
      .limit(usersPerPage);

    res.json({
      users,
      currentPage: pageNumber,
      totalPages: Math.ceil(count / usersPerPage),
      totalUsers: count
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Get a single user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ id: parseInt(req.params.id) });
    if (!user) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.json(user);
    }
  } catch (error) {
    console.error("GetUserById Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Create a new user
exports.createUser = async (req, res) => {
  try {
    const lastUser = await User.findOne().sort({ id: -1 });
    const highestId = lastUser ? lastUser.id : 0; 

    const newUser = new User({
      id: highestId + 1,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      gender: req.body.gender,
      avatar: req.body.avatar,
      domain: req.body.domain,
      available: req.body.available,
    });

    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    console.error("CreateUser Error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Update an existing user
exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { id: req.params.id }, 
      { $set: req.body }, 
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    } else {
      return res.json(updatedUser);
    }
  } catch (error) {
    console.error("UpdateUser Error:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({ id: req.params.id });
    if (!deletedUser) res.status(404).json({ message: "User not found" });
    else res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("DeleteUser Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.getOptions = async (req, res) => {
  try {
      const domains = await User.distinct("domain");
      const genders = await User.distinct("gender");
      const availability = [true, false];

      res.json({
          domains,
          genders,
          availability
      });
  } catch (error) {
      console.error("Error fetching filter options:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
