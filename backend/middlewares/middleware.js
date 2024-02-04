// const { JWT_SECRET } = require('../config');
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization; 
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ message: 'Unauthorized1' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });

        if (decoded && decoded._id) {
            req.userId = decoded._id;
            next();
        } else {
            res.status(403).json({ message: 'Unauthorized2' });
        }
    } catch (error) {
        console.error('Error verifying JWT:', error);
        return res.status(403).json({ message: 'Unauthorized3' });
    }
};

module.exports = authMiddleware;
