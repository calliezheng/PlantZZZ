const express = require("express");
const router = express.Router();
const { Plant, Picture } = require("../models");

router.get('/', async (req, res) => {
    try {
      // Fetch 10 random plants with their pictures
      const plants = await Plant.findAll({
        include: [{ model: Picture }],
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

module.exports = router;