const express = require("express");
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const { User, Product, Product_Type, Purchase, sequelize } = require("../models");

// Save picture into folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const destPath = path.join(__dirname, '..', 'images', 'product picture');
    cb(null, destPath);
  },
  filename: function (req, file, cb) {
    const productName = req.body.product_name.replace(/\s+/g, '-').toLowerCase();
    cb(null, `${productName}-${Date.now()}${path.extname(file.originalname).toLowerCase()}`);
  }
});

const upload = multer({ storage: storage });

// Fetch data from product table
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

// Fetch data from user table to get the score
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

// Fetch data from product table for the manage product page
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

// Fetch the product type from the product_type table
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

//Update the scores of user table when users purchase products with their scores
router.post('/purchase/:userId', async (req, res) => {
  const { userId } = req.params;
  const { productId, quantity } = req.body;

  const transaction = await sequelize.transaction();
  try {
      const product = await Product.findByPk(productId);
      const user = await User.findByPk(userId);
      
      if (!product) {
          return res.status(404).send('Product not found');
      }

      if (!user) {
          return res.status(404).send('User not found');
      }

      if (user.score >= product.price * quantity) {
          // Deduct score
          user.score -= product.price * quantity;
          await user.save({ transaction });

          // Check if purchase record already exists
          const existingPurchase = await Purchase.findOne({
              where: {
                  user_id: userId,
                  product_id: productId
              }
          });

          if (existingPurchase) {
              // Update existing record
              existingPurchase.quantity += quantity;
              await existingPurchase.save({ transaction });
          } else {
              // Create new purchase record
              await Purchase.create({
                  user_id: userId,
                  product_id: productId,
                  quantity: quantity
              }, { transaction });
          }

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

// Update the purchase table for user who bought products
router.get("/:id/cart", async (req, res) => {
  const userId = req.params.id;

  try {
      const purchases = await Purchase.findAll({
          where: { user_id: userId },
          include: [{
              model: Product,
              attributes: ['id', 'product_name', 'picture']
          }],
          attributes: ['product_id', 'quantity'], // Fetch product_id and quantity directly
      });

      res.json(purchases);
  } catch (error) {
      console.error('Failed to fetch purchases:', error);
      res.status(500).send('Error fetching user purchases');
  }
});

// Add product in product table
router.post('/product/add', upload.single('picture'), async (req, res) => {
    try {
      const product = await Product.create({
        product_name: req.body.product_name,
        price: req.body.price,
        picture: req.file.filename,
        product_type: req.body.product_type,
        is_active: 1
      });

      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ error: 'Error creating new product' });
    }
  });

// Edit product in product table
router.put('/product/edit/:id', upload.single('picture'), async (req, res) => {
  const productId = req.params.id;
  const transaction = await sequelize.transaction();
  try {
    // Fetch the existing product to get the old picture path
    const existingProduct = await Product.findOne({
      where: { id: productId }
    });

    if (!existingProduct) {
      await transaction.rollback();
      return res.status(404).json({ error: 'Product not found' });
    }

    // Construct update data
    const updateData = {
      product_name: req.body.product_name,
      price: req.body.price,
      product_type: req.body.product_type
    };

    // Check if a new picture was uploaded and an old picture exists
    if (req.file && existingProduct.picture) {
      const oldPicturePath = path.join(__dirname, '..', 'images', 'product picture', existingProduct.picture);
      // Delete the old picture
      fs.unlink(oldPicturePath, (err) => {
        if (err) {
          console.error('Failed to delete old picture:', err);
        }
      });
    }

    // Add new picture to update data if uploaded
    if (req.file) {
      updateData.picture = req.file.filename;
    }

    // Update product details within a transaction
    await Product.update(updateData, {
      where: { id: productId },
      transaction: transaction
    });

    // Commit the transaction
    await transaction.commit();

    // Fetch the updated product to return in the response
    const updatedProduct = await Product.findOne({ where: { id: productId } });
    if (updatedProduct) {
      res.json(updatedProduct);
    } else {
      res.status(404).json({ error: 'Product not found after update' });
    }
  } catch (error) {
    // Rollback the transaction in case of an error
    await transaction.rollback();
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Error updating product' });
  }
});

// Inactive the product in product table
router.patch('/product/deactivate/:id', async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    // Update the product's is_active field to 0
    await Product.update(
      { is_active: 0 },
      { where: { id: req.params.id } },
      { transaction }
    );
    
    await transaction.commit();
    res.status(204).send();
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: 'Error updating product and picture status' });
  }
});

// Active the product in product table
router.patch('/product/activate/:id', async (req, res) => {
const transaction = await sequelize.transaction();
try {
  // Update the product's is_active field to 1
  await Product.update(
    { is_active: 1 },
    { where: { id: req.params.id } },
    { transaction }
  );
  
  await transaction.commit();
  res.status(204).send();
} catch (error) {
  await transaction.rollback();
  res.status(500).json({ error: 'Error updating product and picture status' });
}
});

module.exports = router;