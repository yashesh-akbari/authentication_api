const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const User = require('./models/User'); // Your Mongoose User model
require('dotenv').config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use('/api', require('./routes/auth'));


// List of temporary email providers
const tempEmailProviders = [
  "tempmail.com", "mailinator.com", "yopmail.com", "guerrillamail.com"
];

// Utility to check if email is temporary
const isTemporaryEmail = (email) => {
  const domain = email.split('@')[1];
  return tempEmailProviders.includes(domain);
};

// Password validation utility
const isValidPassword = (password) => {
  const length = password.length >= 8 && password.length <= 20;
  const uppercase = /[A-Z]/.test(password);
  const lowercase = /[a-z]/.test(password);
  const number = /\d/.test(password);
  const specialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
  return length && uppercase && lowercase && number && specialChar;
};

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

// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');

    // Register route
    app.post('/api/register', async (req, res) => {
      const { fname, lname, email, phone, password } = req.body;

      // Name validation
      if (fname.length < 3 || lname.length < 3) {
        return res.status(400).json({ message: 'First and last name must be at least 3 characters long.' });
      }

      // Email validation
      if (isTemporaryEmail(email)) {
        return res.status(400).json({ message: 'Temporary email addresses are not allowed.' });
      }

      // Phone validation
      if (!/^\d{10}$/.test(phone)) {
        return res.status(400).json({ message: 'Phone number must be exactly 10 digits.' });
      }

      // Password validation
      if (!isValidPassword(password)) {
        return res.status(400).json({
          message: 'Password must include 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character, and be 8-20 characters long.'
        });
      }

      try {
        // Check for existing email
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
          return res.status(400).json({ message: 'Email is already registered.' });
        }

        // Check for existing phone
        const existingPhone = await User.findOne({ phone });
        if (existingPhone) {
          return res.status(400).json({ message: 'Phone number is already registered.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = new User({
          fname,
          lname,
          email,
          phone,
          password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ message: 'Account created successfully!' });
      } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ message: 'Something went wrong, please try again later.' });
      }
    });

    // Start the server
    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });

  })
  .catch((err) => {
    console.error('❌ MongoDB Atlas connection error:', err);
  });
