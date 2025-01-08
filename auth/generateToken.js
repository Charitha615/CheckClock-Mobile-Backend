const jwt = require('jsonwebtoken');

function generateToken(user) {
    if (!user) return;

    if (user.username !== process.env.AUTH_USERNAME || user.password !== process.env.AUTH_PASSWORD) {
        throw "Unauthorized Access";
    }

    const secret = process.env.JWT_SECRET;
    return jwt.sign(user, secret);
}

module.exports = generateToken;