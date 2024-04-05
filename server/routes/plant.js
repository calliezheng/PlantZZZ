const express = require("express");
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { sequelize, plant:Plant, picture:Picture } = require("../models");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destPath = path.join(__dirname, '..', 'images', 'plant picture');
    cb(null, destPath);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}${path.extname(file.originalname).toLowerCase()}`);
  }
});


const upload = multer({ storage: storage });

// Create a new plant
router.post('/', upload.single('picture'), async (req, res) => {
    try {
      const plant = await Plant.create({
        acadamic_name: req.body.acadamic_name,
        daily_name: req.body.daily_name,
        is_active: 1
      });
      
      if (req.file) {
        const picture = await Picture.create({
          picture_file_name: req.file.filename,
          plant_id: plant.id,
          is_active: 1
        });
      }

      res.status(201).json(plant);
    } catch (error) {
      res.status(500).json({ error: 'Error creating new plant' });
    }
  });
  
  // Update an existing plant
  router.put('/:id', async (req, res) => {
    try {
      const updatedPlant = await Plant.update(req.body, {
        where: { id: req.params.id },
        returning: true,
      });
      res.json(updatedPlant);
    } catch (error) {
      res.status(500).json({ error: 'Error updating plant' });
    }
  });
  
  // Delete a plant
  router.patch('/deactivate/:id', async (req, res) => {
    const transaction = await sequelize.transaction();
    try {
      // Update the plant's is_active field to 0
      await Plant.update(
        { is_active: 0 },
        { where: { id: req.params.id } },
        { transaction }
      );
      
      // Update the related pictures' is_active field to 0
      await Picture.update(
        { is_active: 0 },
        { where: { plant_id: req.params.id } },
        { transaction }
      );

      await transaction.commit();
      res.status(204).send();
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({ error: 'Error updating plant and picture status' });
    }
});

  
module.exports = router;