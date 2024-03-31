const jwt = require('jsonwebtoken');
const User = require('../model/user');

const signUp = async (req, res) => {
    try {
        const { email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }
        const newUser = new User({ email, password });
        await newUser.save();
        res.status(201).json({ status: 201, message: 'User created successfully' });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Please Sign Up' });
        };

        if (password != user.password) {
            return res.status(400).json({ message: 'Please enter correct password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        // req.token = token;
        res.json({ status: 200, token: token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

module.exports = { signUp, signIn };