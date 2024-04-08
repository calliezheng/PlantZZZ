const express = require("express");
const router = express.Router();
const { User } = require("../models");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get('/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findByPk(userId);
      if (user) {
        res.json(user);
      } else {
        res.status(404).send('User not found');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).send('Error fetching user profile');
    }
  });

  router.put('/:id', async (req, res) => {
    try {
      const userId = req.params.id;
      const updatedData = req.body;
      const updatedRowCount = await User.update(updatedData, {
        where: { id: userId },
      });
  
      if (updatedRowCount[0] > 0) {
        // If the update was successful, fetch the updated user
        const updatedUser = await User.findByPk(userId);
        if (updatedUser) {
          res.json(updatedUser);
        } else {
          res.status(404).send('User not found after update');
        }
      } else {
        res.status(404).send('User not found');
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).send('Error updating user profile');
    }
  });
  
  router.put('/:id/password', async (req, res) => {
    try {
      const userId = req.params.id;
      const { currentPassword, newPassword } = req.body;
  
      // Retrieve the user by id
      const user = await User.findByPk(userId);
      
      // Check if user was found
      if (!user) {
        return res.status(404).send('User not found');
      }

      // Validate the current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).send('Current password is incorrect');
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Update the user's password in the database
      const [updatedRowCount] = await User.update({ password: hashedPassword }, {
        where: { id: userId },
      });
  
      if (updatedRowCount > 0) {
        res.send('Password updated successfully.');
      } else {
        res.status(404).send('User not found.');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      res.status(500).send('Error updating password');
    }
});

  module.exports = router;
  

