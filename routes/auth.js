// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');

// // POST route for user registration
// router.post('/register', async (req, res) => {
//   const { fname, lname, email, phone, password } = req.body;

//   try {
//     const existingEmail = await User.findOne({ email });
//     const existingPhone = await User.findOne({ phone });

//     if (existingEmail || existingPhone) {
//       return res.status(400).json({
//         message: existingEmail
//           ? 'Email already exists'
//           : 'Phone number already exists',
//       });
//     }

//     const newUser = new User({ fname, lname, email, phone, password });
//     await newUser.save();

//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (err) {
//     console.error('Error in registration:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // GET route to fetch all users
// router.get('/register', async (req, res) => {
//   try {
//     const users = await User.find(); // Fetches all users from the database
//     res.status(200).json(users);
//   } catch (err) {
//     console.error('Error in fetching users:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// const mongoose = require('mongoose');

// // PUT route
// router.put('/register/:id', async (req, res) => {
//   if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//     return res.status(400).json({ message: 'Invalid user ID' });
//   }

//   const { fname, lname, email, phone, password } = req.body;

//   try {
//     const updatedUser = await User.findByIdAndUpdate(
//       req.params.id,
//       { fname, lname, email, phone, password },
//       { new: true }
//     );

//     if (!updatedUser) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.status(200).json({ message: 'User updated successfully', updatedUser });
//   } catch (err) {
//     console.error('Error in updating user:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // DELETE route
// router.delete('/register/:id', async (req, res) => {
//   if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
//     return res.status(400).json({ message: 'Invalid user ID' });
//   }

//   try {
//     const deletedUser = await User.findByIdAndDelete(req.params.id);

//     if (!deletedUser) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     res.status(200).json({ message: 'User deleted successfully' });
//   } catch (err) {
//     console.error('Error in deleting user:', err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });


// module.exports = router;
// routes/auth.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User');

// Create user (register)
router.post('/register', async (req, res) => {
  const { fname, lname, email, phone, password } = req.body;

  try {
    const existingEmail = await User.findOne({ email });
    const existingPhone = await User.findOne({ phone });

    if (existingEmail || existingPhone) {
      return res.status(400).json({
        message: existingEmail
          ? 'Email already exists'
          : 'Phone number already exists',
      });
    }

    const newUser = new User({ fname, lname, email, phone, password });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error in registration:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
router.get('/register', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a user by ID
router.put('/register/:id', async (req, res) => {
  const { id } = req.params;
  const { fname, lname, email, phone, password } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { fname, lname, email, phone, password },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User updated', updatedUser });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a user by ID
router.delete('/register/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
