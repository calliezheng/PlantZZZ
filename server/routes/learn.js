const express = require("express");
const router = express.Router();
const { plant: Plant, picture: Picture } = require("../models");

// GET route to fetch all plants with only their cover picture
router.get("/", async (req, res) => {
    try {
        const plants = await Plant.findAll({
            where: { is_active: 1 },
            include: [{
                model: Picture,
                as: 'Pictures',
                where: { is_active: 1 },
                limit: 1, // Only fetch the first picture
                separate: true, // Necessary for 'limit' to work in 'hasMany' associations
                order: [['id', 'ASC']], // Assuming 'id' determines the first picture; adjust if needed
            }]
        });
        res.json(plants);
    } catch (error) {
        console.error('Error fetching plants with cover picture:', error);
        res.status(500).send('Error fetching plant data');
    }
});


// GET route to fetch all pictures for a specific plant
router.get("/:plantId/pictures", async (req, res) => {
    try {
        const plantId = parseInt(req.params.plantId, 10); // Ensure plantId is an integer
        const pictures = await Picture.findAll({
            where: { plant_id: plantId },
            order: [['id', 'ASC']] // Assuming 'id' orders pictures; adjust as needed
        });
        res.json(pictures);
    } catch (error) {
        console.error(`Error fetching pictures for plant ${req.params.plantId}:`, error);
        res.status(500).send('Error fetching pictures for the plant');
    }
});


module.exports = router;
