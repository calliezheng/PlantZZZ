const express = require("express");
const router = express.Router();
const { Plant, Picture } = require("../models");

// fetch data from plant table with plant's picture in picture table
router.get("/", async (req, res) => {
    try {
        const plants = await Plant.findAll({
            where: { is_active: 1 },
            include: [{
                model: Picture,
                as: 'Pictures',
                where: { is_active: 1 },
                limit: 1, // Fetch one if there are many
                separate: true, 
                order: [['id', 'ASC']], 
            }]
        });
        res.json(plants);
    } catch (error) {
        console.error('Error fetching plants with cover picture:', error);
        res.status(500).send('Error fetching plant data');
    }
});


// Fetch all pictures for a specific plant
router.get("/:plantId/pictures", async (req, res) => {
    try {
        const plantId = parseInt(req.params.plantId, 10);
        const pictures = await Picture.findAll({
            where: { plant_id: plantId },
            order: [['id', 'ASC']]
        });
        res.json(pictures);
    } catch (error) {
        console.error(`Error fetching pictures for plant ${req.params.plantId}:`, error);
        res.status(500).send('Error fetching pictures for the plant');
    }
});


module.exports = router;
