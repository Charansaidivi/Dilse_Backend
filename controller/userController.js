const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const dotEnv = require('dotenv');
dotEnv.config();

const secretKey = process.env.MyName;

// User Registration
const userRegister = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        return res.status(201).json({ msg: 'User registered successfully' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: 'Error in registration',
            type: error.name,
            location: 'bcrypt.hash',
            error: error.message,
        });
    }
};

// User Login
const userLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
        const userId = user._id;

        res.status(200).json({ msg: 'Login successful', token, userId });
        console.log(email);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
};

module.exports = { userRegister, userLogin };
