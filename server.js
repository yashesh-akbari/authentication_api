const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const User = require('./models/User'); // Mongoose User model
require('dotenv').config();

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send(`
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h1>👋 Welcome to the <span style="color: #0070f3;">Auth API</span></h1>
      <p>You can test the following API endpoints using <strong>Postman</strong> or <strong>Thunder Client</strong>:</p>
      
      <ul style="line-height: 1.8;">
        <li>📥 <strong>POST</strong> <code>/api/register</code> – Register a new user</li>
        <li>📄 <strong>GET</strong> <code>/api/register</code> – Get all registered users</li>
        <li>✏️ <strong>PUT</strong> <code>/api/register/:id</code> – Update user by ID</li>
        <li>🗑️ <strong>DELETE</strong> <code>/api/register/:id</code> – Delete user by ID</li>
      </ul>

      <p style="margin-top: 30px;">💪 <em>Happy testing!</em></p>
      <hr style="margin-top: 40px;">
      <footer style="font-size: 14px; color: #888;">
        &copy; 2025 Yashesh Akbari
      </footer>
    </div>
  `);
});

// List of temporary email providers
const tempEmailProviders = [
  "tempmail.com", "mailinator.com", "yopmail.com", "guerrillamail.com"
];

// Utility: check for temp email
const isTemporaryEmail = (email) => {
  const domain = email.split('@')[1];
  return tempEmailProviders.includes(domain);
};

// Utility: password validation
const isValidPassword = (password) => {
  const length = password.length >= 8 && password.length <= 20;
  const uppercase = /[A-Z]/.test(password);
  const lowercase = /[a-z]/.test(password);
  const number = /\d/.test(password);
  const specialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  return length && uppercase && lowercase && number && specialChar;
};

// POST /api/register
app.post('/api/register', async (req, res) => {
  const { fname, lname, email, phone, password } = req.body;
  const errors = [];

  // First Name
  if (!fname || typeof fname !== 'string' || fname.trim().length < 3) {
    errors.push("First name must be at least 3 characters long.");
  }

  // Last Name
  if (!lname || typeof lname !== 'string' || lname.trim().length < 3) {
    errors.push("Last name must be at least 3 characters long.");
  }

  // Email
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    errors.push("A valid email is required.");
  } else {
    const domain = email.split('@')[1];
    if (isTemporaryEmail(email)) {
      errors.push("Temporary email addresses are not allowed.");
    }
  }

  // Phone
  if (!phone || !/^\d{10}$/.test(phone)) {
    errors.push("Phone number must be exactly 10 digits.");
  }

  // Password
  if (!password || typeof password !== 'string') {
    errors.push("Password is required.");
  } else if (!isValidPassword(password)) {
    errors.push("Password must include 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character, and be 8-20 characters long.");
  }

  // Return all validation errors
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    // Check for duplicates
    const [existingEmail, existingPhone] = await Promise.all([
      User.findOne({ email }),
      User.findOne({ phone }),
    ]);

    if (existingEmail) {
      errors.push("Email is already registered.");
    }
    if (existingPhone) {
      errors.push("Phone number is already registered.");
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fname: fname.trim(),
      lname: lname.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "Account created successfully!" });

  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Something went wrong. Please try again later." });
  }
});

// GET /api/register – Get all registered users
app.get('/api/register', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Failed to retrieve users." });
  }
});

// PUT /api/register/:id – Update user by ID
app.put('/api/register/:id', async (req, res) => {
  const { id } = req.params;
  const { fname, lname, phone } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { fname, lname, phone },
      { new: true, runValidators: true }
    ).select('-password'); // Exclude password

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User updated successfully.", user: updatedUser });
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Failed to update user." });
  }
});

// DELETE /api/register/:id – Delete user by ID
app.delete('/api/register/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User deleted successfully." });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: "Failed to delete user." });
  }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });
