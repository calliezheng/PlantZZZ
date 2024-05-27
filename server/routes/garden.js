const express = require("express");
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const { Purchase, Garden, sequelize } = require("../models");

// Update the quantity of product in Purchase table
router.post('/:userId/cart', async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    const { productId, increment } = req.body;

    try {
        const purchase = await Purchase.findOne({
            where: { user_id: userId, product_id: productId }
        });

        if (purchase) {
            purchase.quantity += (increment ? 1 : -1);
            await purchase.save();
            res.send({ message: "Quantity updated successfully", purchase });
        } else {
            res.status(404).send({ message: "Purchase not found" });
        }
    } catch (error) {
        console.error("Failed to update quantity:", error);
        res.status(500).send({ error: "Internal server error" });
    }
});

// Update the data of garden layout in the garden table
router.post('/:userId/garden', async (req, res) => {
    const { userId, gardenState } = req.body;
  
    try {
      const garden = await Garden.findByPk(userId);
      if (garden) {
        garden.garden_state = gardenState;
        await garden.save();
      } else {
        await Garden.create({
          user_id: userId,
          garden_state: gardenState
        });
      }
      res.send({ message: 'Garden state saved successfully.' });
    } catch (error) {
      console.error('Error saving garden state:', error);
      res.status(500).send({ error: 'Failed to save garden state' });
    }
  });
  
  // Fetch the data from garden table
  router.get('/:userId/garden', async (req, res) => {
    const userId = req.params.userId;
    try {
        const garden = await Garden.findOne({
            where: { user_id: userId }
        });
        if (garden) {
            res.json(garden);
        } else {
            res.status(404).send('Garden not found');
        }
    } catch (error) {
        console.error('Error fetching garden state:', error);
        res.status(500).send('Error fetching garden state');
    }
});

module.exports = router;