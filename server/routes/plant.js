const express = require("express");
const multer = require('multer');
const path = require('path');
const router = express.Router();
const { plant:Plant, picture:Picture } = require("../models");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destPath = path.join(__dirname, '..', 'images', 'plant_pictures');
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
  router.delete('/:id', async (req, res) => {
    try {
      await Plant.destroy({
        where: { id: req.params.id },
      });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error deleting plant' });
    }
  });
  
module.exports = router;