const express = require("express");
const { createSession, removeSession, requireAdmin } = require("../middleware/adminAuth");

const router = express.Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body || {};
  const expectedUser = process.env.ADMIN_USER || "admin";
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword) {
    return res.status(500).json({ message: "ADMIN_PASSWORD .env dosyasında tanımlı değil." });
  }

  if (username !== expectedUser || password !== expectedPassword) {
    return res.status(401).json({ message: "Kullanıcı adı veya şifre yanlış." });
  }

  res.json({ token: createSession() });
});

router.post("/logout", requireAdmin, (req, res) => {
  removeSession(req.adminToken);
  res.json({ message: "Çıkış yapıldı." });
});

router.get("/session", requireAdmin, (_req, res) => {
  res.json({ active: true });
});

module.exports = router;
