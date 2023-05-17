const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    if (req.method === 'OPTIONS') {
        next()
    }
    try {
        const tryToken = req.headers.authorization
        if (!tryToken) {
            res.status(401).json({message: 'Не авторизован'})
        } else {
            const token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.TOKEN_KEY)
            req.userId = decoded.id
            console.log(decoded.id)
            next()
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}