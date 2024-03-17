const express = require("express");
const router = express.Router();


router.get("/", async (req, res) => {
    res.json("PlantZZZ")
});

router.post("/", (req, res) => {
    const post = req.body;
});

module.exports = router;