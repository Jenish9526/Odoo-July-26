import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'transitops-secret-key-2026';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '30d';

// POST /api/auth/login
export const login = async (req, res, next) => {
    try {
        const { email, password, rememberMe } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials. Please verify your email and password.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials. Please verify your email and password.' });
        }

        if (!user.isActive) {
            return res.status(403).json({ success: false, message: 'Account has been deactivated. Contact administrator.' });
        }

        const expiresIn = rememberMe ? '30d' : '1d';
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role, name: user.name },
            JWT_SECRET,
            { expiresIn }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });
    } catch (err) {
        next(err);
    }
};

// GET /api/auth/me
export const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.json({ success: true, user });
    } catch (err) {
        next(err);
    }
};
