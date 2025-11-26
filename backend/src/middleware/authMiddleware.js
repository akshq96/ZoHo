const jwt = require('jsonwebtoken');
const response = require('../utils/responseHandler');

const authMiddleware = (req, res, next) => {
    const authToken = req.cookies?.auth_token;
    if (!authToken) {
        return response(res, 401, false, 'Authentication token missing');
    }
    try {
        const decode = jwt.verify(authToken, process.env.JWT_SECRET);
        req.user = decode;
        next();
    } catch (error) {
        console.error('JWT Verification Error:', error);
        return response(res, 401, false, 'Invalid authentication token');
    }
}
module.exports = authMiddleware;