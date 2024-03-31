const jwt = require('jsonwebtoken');

const authenticateToken = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if (!token) return res.status(401).json({ message: 'Unauthorized' });
        jwt.verify(token, process.env.JWT_SECRET, function (error, decoded) {
            if (error) {
                if (error) return res.status(403).json({ message: 'Forbidden' });
            }
            req.user = decoded
            next()
        })
    } catch (error) {
        return res.status(500).send(error.message)
    }
}

module.exports = { authenticateToken };