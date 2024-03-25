const express = require("express");
const router = express.Router();
const { Plant } = require("../models");

router.get("/learn", async (req, res) => {
    try {
        const plants = await Plant.findAll();
        res.json(plants);
    } catch (error) {
        console.error('Error fetching plant data:', error);
        res.status(500).send('Error fetching plant data');
    }
});

router.post("/learn", async (req, res) => {

});

module.exports = router;