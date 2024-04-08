const express = require("express");
const router = express.Router();
const { User } = require("../models");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get('/', (req, res) => {
  res.send('Home Page');
});

router.post('/signin', async (req, res) => {
  console.log('Received sign-in request:', req.body);
  try {
    console.log(User);
    const { username, password } = req.body;
    if (!username || !password) {
      console.log('Username or password not provided');
      return res.status(400).send({ success: false, message: 'Username and password are required' });
    }

    console.log('Looking for user:', username);
    const user = await User.findOne({ where: { username } });

    if (!user) {
      console.log('User not found:', username);
      return res.status(401).send({ success: false, message: 'Authentication failed: user not found' });
    }
    console.log('User found, checking password for user:', username);
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      console.log('Invalid password for user:', username);
      return res.status(401).send({ success: false, message: 'Authentication failed: password incorrect' });
    }
    console.log('Password valid for user:', username);
    const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
    return res.json({ success: true, message: 'Authentication successful', token, user_id: user.id, username: user.username, user_type: user.user_type});

  } catch (error) {
    console.error('SignIn Error:', error);
    return res.status(500).send({ success: false, message: 'Internal Server Error' });
  }
});


router.post('/signup', async (req, res) => {
  try {
    console.log('Received data:', req.body);
    const { username, email, password } = req.body;
    console.log('Checking for existing user...');
    const existingUser = await User.findOne({ where: { username } });

    if (existingUser) {
      console.log('User already exists:', username);
      return res.status(409).send({ error: 'User already exists' });
    }

    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log('Creating new user...');
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      user_type:2,
      is_active:1
    });

    console.log('Generating token...');
    const token = jwt.sign({ id: newUser.id }, 'secret', { expiresIn: '1h' });

    console.log('User created:', newUser);
    return res.status(201).send({ success: true, message: 'User created successfully', token });
  } catch (error) {
    console.error('Signup Error:', error);
    return res.status(500).send({ error: error.message });
  }
});

module.exports = router;