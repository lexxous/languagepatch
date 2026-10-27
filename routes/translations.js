const express = require("express");
const mongoose = require("mongoose");
const Translation = require("../models/Translation");
const { requireAdmin } = require("../middleware/adminAuth");

const router = express.Router();

function validId(id) {
  return mongoose.isValidObjectId(id);
}

router.get("/", async (_req, res, next) => {
  try {
    const items = await Translation.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) { next(error); }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: "Geçersiz yama kimliği." });
    const item = await Translation.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Yama bulunamadı." });
    res.json(item);
  } catch (error) { next(error); }
});

router.post("/", requireAdmin, async (req, res, next) => {
  try {
    const item = await Translation.create(req.body);
    res.status(201).json(item);
  } catch (error) { next(error); }
});

router.put("/:id", requireAdmin, async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: "Geçersiz yama kimliği." });
    const item = await Translation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: "Yama bulunamadı." });
    res.json(item);
  } catch (error) { next(error); }
});

router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: "Geçersiz yama kimliği." });
    const item = await Translation.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Yama bulunamadı." });
    res.json({ message: "Yama silindi." });
  } catch (error) { next(error); }
});

router.post("/:id/rate", async (req, res, next) => {
  try {
    const score = Number(req.body.score);
    if (!validId(req.params.id)) return res.status(400).json({ message: "Geçersiz yama kimliği." });
    if (!Number.isInteger(score) || score < 1 || score > 5) return res.status(400).json({ message: "Puan 1-5 arasında olmalıdır." });
    const item = await Translation.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Yama bulunamadı." });
    const count = item.ratingCount || 0;
    item.rating = Number((((item.rating || 0) * count + score) / (count + 1)).toFixed(1));
    item.ratingCount = count + 1;
    await item.save();
    res.json(item);
  } catch (error) { next(error); }
});

router.post("/:id/comments", async (req, res, next) => {
  try {
    const { author, content } = req.body || {};
    const rating = Number(req.body.rating);
    if (!validId(req.params.id)) return res.status(400).json({ message: "Geçersiz yama kimliği." });
    if (!author?.trim() || !content?.trim()) return res.status(400).json({ message: "İsim ve yorum zorunludur." });
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) return res.status(400).json({ message: "Puan 1-5 arasında olmalıdır." });
    const item = await Translation.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Yama bulunamadı." });
    item.comments.push({ author: author.trim(), content: content.trim(), rating });
    const count = item.ratingCount || 0;
    item.rating = Number((((item.rating || 0) * count + rating) / (count + 1)).toFixed(1));
    item.ratingCount = count + 1;
    await item.save();
    res.status(201).json(item);
  } catch (error) { next(error); }
});

router.post("/:id/download", async (req, res, next) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: "Geçersiz yama kimliği." });
    const item = await Translation.findByIdAndUpdate(req.params.id, { $inc: { downloads: 1 } }, { new: true });
    if (!item) return res.status(404).json({ message: "Yama bulunamadı." });
    res.json(item);
  } catch (error) { next(error); }
});

module.exports = router;
