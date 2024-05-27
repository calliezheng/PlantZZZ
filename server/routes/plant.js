const express = require("express");
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const { sequelize, Plant, Picture } = require("../models");

// Save picture into folder
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

// Insert new plant to plant table
router.post('/', upload.single('picture'), async (req, res) => {
    try {
      const plant = await Plant.create({
        academic_name: req.body.academic_name,
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
  
  // Edit plant data in plant table
  router.put('/:id', upload.single('picture'), async (req, res) => {
    const plantId = req.params.id;
    const transaction = await sequelize.transaction();
    try {
        // Update plant details within a transaction
        await Plant.update(
            {
                academic_name: req.body.academic_name,
                daily_name: req.body.daily_name
            },
            {
                where: { id: plantId },
                transaction: transaction
            }
        );

        // If a new picture was uploaded, handle the old picture deletion
        if (req.file) {
            // Find and delete the old picture if it exists
            const oldPicture = await Picture.findOne({
                where: { plant_id: plantId, is_active: 1 }
            });

            if (oldPicture) {
                // Delete the picture file from the server
                const oldPicturePath = path.join(__dirname, '..', 'images', 'plant picture', oldPicture.picture_file_name);
                fs.unlinkSync(oldPicturePath); 

                // Delete the picture record from the database
                await Picture.destroy({
                    where: { id: oldPicture.id },
                    transaction: transaction
                });
            }

            // Add new picture
            await Picture.create({
                picture_file_name: req.file.filename,
                plant_id: plantId,
                is_active: 1
            }, { transaction });
        }
        await transaction.commit();

        // Fetch the updated plant to return in the response
        const updatedPlant = await Plant.findByPk(plantId, {
            include: [{
                model: Picture,
                as: 'Pictures',
                where: { is_active: 1 },
                required: false
            }]
        });

        res.json(updatedPlant);

    } catch (error) {
        // Rollback the transaction in case of an error
        await transaction.rollback();
        console.error('Error updating plant:', error);
        res.status(500).json({ error: 'Error updating plant and picture' });
    }
});
  
  
  // Inactive a plant in plant table
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