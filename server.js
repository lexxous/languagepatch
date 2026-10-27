const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const translationRoutes = require("./routes/translations");
const adminRoutes = require("./routes/admin");

const app = express();
const PORT = process.env.PORT || 5000;

app.disable("x-powered-by");
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.get("/api/test", (_req, res) => res.json({ success: true, message: "API çalışıyor" }));
app.use("/api/translations", translationRoutes);
app.use("/api/admin", adminRoutes);

app.use(express.static(path.join(__dirname, "public")));
app.get("/{*splat}", (_req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

app.use((error, _req, res, _next) => {
  console.error(error);
  if (error.name === "ValidationError") {
    return res.status(400).json({ message: Object.values(error.errors).map(e => e.message).join(" ") });
  }
  res.status(500).json({ message: "Sunucuda beklenmeyen bir hata oluştu." });
});

async function startServer() {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI .env dosyasında tanımlı değil.");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB bağlantısı başarılı.");
    app.listen(PORT, () => console.log(`Sunucu çalışıyor: http://localhost:${PORT}`));
  } catch (error) {
    console.error("Sunucu başlatılamadı:", error.message);
    process.exit(1);
  }
}

startServer();
