const express = require("express");
const router = express.Router();
const { User, Product, Product_Type, Purchase, sequelize } = require("../models");

router.get("/", async (req, res) => {
    try {
        const products = await Product.findAll({
            where: { is_active: 1 },
            include: [{
                model: Product_Type,
                as: 'ProductType',
                where: { is_active: 1 },
            }]
        });
        console.log(products);
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Error fetching products');
    }
});

router.get("/:id", async (req, res) => {
    try {
        const userId = req.params.id;  
        const user = await User.findByPk(userId); 
        
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

router.get("/product/manage", async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [{
                model: Product_Type,
                as: 'ProductType',
                where: { is_active: 1 },
            }]
        });
        console.log(products);
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Error fetching products');
    }
});

router.get("/product/type", async (req, res) => {
    try {
        const types = await Product_Type.findAll();
        console.log(types);
        res.json(types);
    } catch (error) {
        console.error('Error fetching types:', error);
        res.status(500).send('Error fetching types');
    }
});

router.post('/purchase/:userId', async (req, res) => {
    const { userId } = req.params;
    const { productId, quantity } = req.body;

    const transaction = await sequelize.transaction();
    try {
        const product = await Product.findByPk(productId);
        const user = await User.findByPk(userId);
        
        if (user.score >= product.price * quantity) {
            // Deduct score
            user.score -= product.price * quantity;
            await user.save({ transaction });

            // Create purchase record
            await Purchase.create({
                user_id: userId,
                product_id: productId,
                quantity: quantity
            }, { transaction });

            await transaction.commit();
            res.send('Purchase successful');
        } else {
            res.status(400).send('Insufficient score');
        }
    } catch (error) {
        await transaction.rollback();
        res.status(500).send('Error processing purchase');
    }
});

router.get("/:id/cart", async (req, res) => {
    const userId = req.params.id;

    try {
        const purchases = await Purchase.findAll({
            where: { user_id: userId },
            include: [{
                model: Product,
                attributes: ['id', 'product_name', 'picture'] 
            }],
            attributes: ['product_id', [sequelize.fn('sum', sequelize.col('quantity')), 'total_quantity']],
            group: ['product_id', 'Product.id'], // Group by product_id and include the Product model's id for correct aggregation
        });

            res.json(purchases);
        } catch (error) {
            console.error('Failed to fetch purchases:', error);
            res.status(500).send('Error fetching user purchases');
        }
});

router.post('/product/add', upload.single('picture'), async (req, res) => {
    try {
      const plant = await Product.create({
        product_name: req.body.product_name,
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

router.put('/product/edit', upload.single('picture'), async (req, res) => {
    const plantId = req.params.id;
    const transaction = await sequelize.transaction();
    try {
      // Update plant details
      await Plant.update(
        { academic_name: req.body.academic_name, daily_name: req.body.daily_name },
        { where: { id: plantId } },
        { transaction }
      );
  
      if (req.file) {
        // Deactivate the old picture
        await Picture.update(
          { is_active: 0 },
          { where: { plant_id: plantId, is_active: 1 } },
          { transaction }
        );
  
        // Add new picture
        await Picture.create({
          picture_file_name: req.file.filename,
          plant_id: plantId,
          is_active: 1
        }, { transaction });
      }
  
      await transaction.commit();
      const updatedPlant = await Plant.findByPk(plantId, {
        include: [{
          model: Picture,
          as: 'Pictures', // Make sure this alias matches your association alias
          where: { is_active: 1 },
          required: false // This ensures that plants without an active picture are still retrieved
        }]
      });
  
      res.json(updatedPlant);
  
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({ error: 'Error updating plant and picture' });
    }
  });

module.exports = router;