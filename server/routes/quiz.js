const express = require("express");
const router = express.Router();
const { sequelize, Plant, Picture, User } = require("../models");
const { Op } = require('sequelize');

// Fetch 10 random plants with their pictures
router.get('/', async (req, res) => {
    try {
      const plants = await Plant.findAll({
        include: [{ model: Picture, as: 'Pictures' }],
        order: sequelize.random(),
        limit: 10
      });

      res.json(plants);
    } catch (error) {
      console.error('Error fetching plants:', error);
      res.status(500).send('Error fetching plants');
    }
  });

// Update score for user in user table
router.post('/:id', express.json(), async (req, res) => {
  const userId = req.params.id;
  const { score } = req.body; 
  const transaction = await sequelize.transaction();

  try {
    const user = await User.findByPk(userId, { transaction });
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ error: 'User not found' });
    }

    const newScore = user.score + score; 
    await User.update(
      { score: newScore },
      { where: { id: userId } },
      { transaction }
    );

    await transaction.commit();
    res.status(200).json({ message: 'Score updated successfully', newScore });

  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: 'Error updating score' });
  }
});

module.exports = router;