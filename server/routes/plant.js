const express = require("express");
const router = express.Router();
const { plant:Plant } = require("../models");

// Create a new plant
router.post('/', async (req, res) => {
    try {
      const { acadamic_name, daily_name } = req.body;
      const newPlant = await Plant.create({acadamic_name, daily_name, is_active: 1});
      res.status(201).json(newPlant);
    } catch (error) {
      res.status(500).json({ error: 'Error creating new plant' });
    }
  });
  
  // Update an existing plant
  router.put('/:id', async (req, res) => {
    try {
      const updatedPlant = await Plant.update(req.body, {
        where: { id: req.params.id },
        returning: true,
      });
      res.json(updatedPlant);
    } catch (error) {
      res.status(500).json({ error: 'Error updating plant' });
    }
  });
  
  // Delete a plant
  router.delete('/:id', async (req, res) => {
    try {
      await Plant.destroy({
        where: { id: req.params.id },
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error deleting plant' });
    }
  });
  
module.exports = router;