const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

function generateToken(user, secret) {
  return jwt.sign({ id: user.id, username: user.username }, secret, { expiresIn: '2h' });
}

function verifyToken(token, secret) {
  return jwt.verify(token, secret);
}

module.exports = {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken
};
