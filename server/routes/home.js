const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const bcrypt = require('bcryptjs');
const app = express();
app.use(express.json());


app.post('/signup', async (req, res) => {
    try {
      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 8);
  
      const newUser = await User.create({
        ID,
        Username,
        Email,
        Password: hashedPassword,
        User_Type: 2,
        is_active
      });
  
      res.status(201).send({ message: 'User registered successfully', newUser });
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  });

  const jwt = require('jsonwebtoken');

app.post('/signin', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send({ error: 'Authentication failed' });
    }

    const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: '1h' });
    res.send({ message: 'Authentication successful', token });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;