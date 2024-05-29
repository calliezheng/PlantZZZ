const express = require("express");
const router = express.Router();
const { Plant, Picture } = require("../models");
const { Op } = require('sequelize');

// fetch data from plant table with one cover picture in picture table
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


// Fetch all pictures for a specific plant except for the cover page
router.get("/:plantId/pictures", async (req, res) => {
    try {
        const plantId = parseInt(req.params.plantId, 10);
        
        // Find the cover picture ID for the given plantId
        const coverPicture = await Picture.findOne({
            where: {
                plant_id: plantId,
                is_active: 1
            },
            order: [['id', 'ASC']]
        });

        const coverPictureId = coverPicture ? coverPicture.id : null;

        const whereCondition = {
            plant_id: plantId,
            is_active: 1
        };

        if (coverPictureId) {
            whereCondition.id = { [Op.ne]: coverPictureId };
        }

        const pictures = await Picture.findAll({
            where: whereCondition,
            order: [['id', 'ASC']]
        });

        res.json(pictures);
    } catch (error) {
        console.error(`Error fetching pictures for plant ${req.params.plantId}:`, error);
        res.status(500).send('Error fetching pictures for the plant');
    }
});


module.exports = router;
