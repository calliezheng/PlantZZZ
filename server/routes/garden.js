const express = require("express");
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const { User, Product, Product_Type, Purchase, sequelize } = require("../models");





module.exports = router;