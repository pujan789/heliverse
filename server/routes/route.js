const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, createUser, updateUser, deleteUser, getOptions } = require('../Controllers/controllers');
const teamController = require('../Controllers/teamController');

// User routes


router.get('/api/users', getAllUsers); // Get users by page number
router.get('/users/options', getOptions); // Specific route comes first

router.get('/api/users/:id', getUserById); // Get user by ID

router.post('/api/users', createUser); // Create a user
router.patch('/api/users/:id', updateUser); // Update a user
router.delete('/api/users/:id', deleteUser); // Delete a user



// Team routes
router.post('/api/team', teamController.createTeam);
router.get('/api/team/:id', teamController.getTeamById);

module.exports = router;
