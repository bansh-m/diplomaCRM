const jwt = require('jsonwebtoken');
require('dotenv').config()

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token || req.headers['authorization'];;
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    try {
        const bearerToken = token.startsWith('Bearer ') ? token.slice(7, token.length).trimLeft() : token;
        const decoded = jwt.verify(bearerToken, process.env.JWT_PRIVATE_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports = authMiddleware;
