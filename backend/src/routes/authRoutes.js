const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma'); // Assuming prisma is properly initialized
const router = express.Router();

// Middleware to authenticate the user
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token from "Bearer <token>"
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // Attach userId to the request object
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Include the user's role in the response
    res.status(200).json({ message: 'Login successful', token, role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/signup', async (req, res) => {
    const { name, email, password, role } = req.body;
  
    try {
      // Check if email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
  
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);
  
      // Create new user
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
        },
      });
  
      // Create JWT token
      const token = jwt.sign({ userId: newUser.id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.status(201).json({ message: 'User created successfully', token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // Get Current User Route
router.get('/user', authenticate, async (req, res) => {
  const userId = req.userId; // Extract userId from the authenticated token

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user details' });
  }
});

// Update User Route (PATCH)
router.patch('/user', authenticate, async (req, res) => {
  const { name, email, password } = req.body;
  const userId = req.userId; // Extract userId from the authenticated token

  try {
    const updatedData = {};

    // Add only the fields that are provided in the request body
    if (name) updatedData.name = name;
    if (email) updatedData.email = email;
    if (password) updatedData.password = await bcrypt.hash(password, 12);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updatedData,
    });

    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user' });
  }
});

// Other routes (Sign-Up, Login, etc.)
module.exports = router;




