const crypto = require("crypto");

const sessions = new Map();
const SESSION_MS = 8 * 60 * 60 * 1000;

function createSession() {
  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, Date.now() + SESSION_MS);
  return token;
}

function removeSession(token) {
  sessions.delete(token);
}

function requireAdmin(req, res, next) {
  const header = req.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const expiresAt = sessions.get(token);

  if (!token || !expiresAt || expiresAt < Date.now()) {
    if (token) sessions.delete(token);
    return res.status(401).json({ message: "Yönetici oturumu geçersiz veya süresi dolmuş." });
  }

  req.adminToken = token;
  next();
}

module.exports = { createSession, removeSession, requireAdmin };
