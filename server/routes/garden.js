const express = require("express");
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const { Purchase, Garden, sequelize } = require("../models");

router.post("/:id/cart", async (req, res) => {
    try {
        const userId = req.params.id;  
        const item_quantity = await Purchase.findOne({
            where: {
              user_id: userId
            }
          });
          
        
        if (user) {
            res.json({ score: user.score });  // Return the score if the user is found
            console.log(user.score);
        } else {
            res.status(404).send('User not found');  // Send a 404 response if no user is found
        }
    } catch (error) {
        console.error('Error fetching score:', error);
        res.status(500).send('Error fetching score');
    }
});



module.exports = router;