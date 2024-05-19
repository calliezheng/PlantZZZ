const express = require("express");
const router = express.Router();
const { sequelize, Plant, Picture, User } = require("../models");
const { Op } = require('sequelize');

// Utility function to shuffle array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

router.get('/', async (req, res) => {
    try {
      // Fetch 10 random plants with their pictures
      const plants = await Plant.findAll({
        include: [{ model: Picture, as: 'Pictures' }],
        order: sequelize.random(), // This is Sequelize specific; adjust for your ORM
        limit: 10
      });
  
      // Respond with the plants data
      res.json(plants);
    } catch (error) {
      console.error('Error fetching plants:', error);
      res.status(500).send('Error fetching plants');
    }
  });

  router.post('/:id', express.json(), async (req, res) => {
    const userId = req.params.id;
    const { score } = req.body; 
    const transaction = await sequelize.transaction();
  
    try {
      // Retrieve the user to update their score
      const user = await User.findByPk(userId, { transaction });
      if (!user) {
        await transaction.rollback();
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Update user score
      const newScore = user.score + score; 
      await User.update(
        { score: newScore },
        { where: { id: userId } },
        { transaction }
      );
  
      // Commit the transaction
      await transaction.commit();
      res.status(200).json({ message: 'Score updated successfully', newScore });
  
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({ error: 'Error updating score' });
    }
  });


module.exports = router;