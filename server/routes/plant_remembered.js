const express = require("express");
const router = express.Router();
const { Plant_Remembered, Plant, Picture } = require("../models");

// Get remembered plants for a specific user
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

router.post("/:userId/add-remembered-plant", async (req, res) => {
    const { user_id, plant_id, remember } = req.body;
    // Authentication and validation logic here
    if (!user_id || !plant_id || !Array.isArray(plant_id)) {
        return res.status(400).json({ error: 'Invalid input' });
    }

    try {
        if (remember) {
          // If 'remember' is true, add the plant to the remembered list
          await Plant_Remembered.findOrCreate({
            where: { user_id, plant_id },
            defaults: {
              user_id,
              plant_id,
              is_active: 1,
            },
          });
        } else {
          // If 'remember' is false, deactivate the remembered plant
          await Plant_Remembered.update(
            { is_active: 0 },
            { where: { user_id, plant_id } }
          );
        }
    
        res.status(200).json({ message: 'Successfully updated remembered plants' });
      } catch (error) {
        console.error('Error updating remembered plants:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
});

module.exports = router;
