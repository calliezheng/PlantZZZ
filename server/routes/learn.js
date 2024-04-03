const express = require("express");
const router = express.Router();
const { plant: Plant, picture: Picture } = require("../models");

// GET route to fetch all plants with their associated pictures
router.get("/", async (req, res) => {
    try {
        const plants = await Plant.findAll({
            include: [{
                model: Picture,
                as: 'Pictures' 
            }]
        });
        res.json(plants);
    } catch (error) {
        console.error('Error fetching plants with pictures:', error);
        res.status(500).send('Error fetching plant data');
    }
});

router.post("/", async (req, res) => {

});

module.exports = router;
