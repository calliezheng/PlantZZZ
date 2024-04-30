const express = require("express");
const router = express.Router();
const { sequelize, User } = require("../models");
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const upload = multer();


router.get("/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        const staffs = await User.findAll({
            where: { id: { [Op.ne]: userId }, user_type: 1, is_active: 1 },
        });
        res.json(staffs);
    } catch (error) {
        console.error('Error fetching staffs with cover picture:', error);
        res.status(500).send('Error fetching staff data');
    }
});

router.post("/", upload.none(), async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash('plantzzz1234+', 10);
        
        const staff = await User.create({
          username: req.body.username,
          email: req.body.email,
          password: hashedPassword,
          user_type: 1,
          is_active: 1
        });
  
        res.status(201).json(staff);
      } catch (error) {
        console.error("Error when adding staff:", error);
        res.status(500).json({ error: 'Error creating new staff' });
      }
    });

    router.patch('/deactivate/:id', async (req, res) => {
        const transaction = await sequelize.transaction();
        try {
          // Update the plant's is_active field to 0
          await User.update(
            { is_active: 0 },
            { where: { id: req.params.id } },
            { transaction }
          );
    
          await transaction.commit();
          res.status(204).send();
        } catch (error) {
          await transaction.rollback();
          res.status(500).json({ error: 'Error updating staff status' });
        }
    });

module.exports = router;