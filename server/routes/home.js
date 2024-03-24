const express = require("express");
const router = express.Router();
const { user: User } = require("../models");
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
    return res.json({ success: true, message: 'Authentication successful', token });

  } catch (error) {
    console.error('SignIn Error:', error);
    return res.status(500).send({ success: false, message: 'Internal Server Error' });
  }
});


router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ where: { username } });

    // Check if user already exists
    if (existingUser) {
      return res.status(409).send({ error: 'User already exists' }); // 409 Conflict
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({
      username,
      email, // Assuming your User model also has an 'email' field
      password: hashedPassword,
    });

    // You might want to create a token for the new user as well
    const token = jwt.sign({ id: newUser.id }, 'secret', { expiresIn: '1h' });

    res.status(201).send({ message: 'User created successfully', token }); // 201 Created
  } catch (error) {
    res.status(500).send({ error: error.message }); // 500 Internal Server Error
  }
});


module.exports = router;