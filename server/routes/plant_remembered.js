const express = require("express");
const router = express.Router();
const { Plant_Remembered, Plant, Picture } = require("../models");

// Fetch data from plant-remembered table
router.get("/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {
        const rememberedPlants = await Plant_Remembered.findAll({
            where: { user_id: userId, is_active: 1 },
            include: [{
                model: Plant,
                as: 'Plant',
                where: { is_active: 1 },
                include: [{
                    model: Picture,
                    as: 'Pictures',
                    where: { is_active: 1 },
                    limit: 1, 
                    separate: true, 
                    order: [['id', 'ASC']],
                }]
            }]
        });

        res.json(rememberedPlants);
    } catch (error) {
        console.error('Error fetching remembered plants:', error);
        res.status(500).send('Error fetching plant data');
    }
});

// Add plant in plant-remembered table
router.post("/:userId/add-remembered-plant", async (req, res) => {
    const { user_id, plant_id, remember } = req.body;
    // Authentication and validation logic here
    if (!user_id || typeof plant_id !== 'number') {
        return res.status(400).json({ error: 'Invalid input' });
    }

    try {
      if (remember) {
        // Add plant to remembered list
        await Plant_Remembered.upsert({
          user_id: user_id,
          plant_id: plant_id,
          is_active: 1
        });
      } else {
        // Remove plant from remembered list
        await Plant_Remembered.update(
          { is_active: 0 },
          { where: { user_id, plant_id: plant_id } }
        );
        }
    
        res.status(200).json({ message: 'Successfully updated remembered plants' });
      } catch (error) {
        console.error('Error updating remembered plants:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
});

module.exports = router;
