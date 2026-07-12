import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'transitops-secret-key-2026';

const auth = (req, res, next) => {
    try {
        const header = req.headers.authorization;
        if (!header || !header.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
        }

        const token = header.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.id;
        req.userRole = decoded.role;
        req.userEmail = decoded.email;
        next();
    } catch (err) {
        res.status(401).json({ success: false, message: 'Invalid or expired token.' });
    }
};

export default auth;
