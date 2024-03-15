const express = require("express");
const router = express.Router();
const { plant } = require("../models");

router.get("/", async (req, res) => {
    const listOfPlants = await learn.findAll();
    res.json(listOfPlants);
});

router.post("/", (req, res) => {
    const post = req.body;
});

module.exports = router;