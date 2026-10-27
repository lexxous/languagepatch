const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  author: { type: String, required: true, trim: true, maxlength: 80 },
  content: { type: String, required: true, trim: true, maxlength: 2000 },
  rating: { type: Number, min: 1, max: 5, default: 5 },
  date: { type: Date, default: Date.now }
}, { _id: true });

const translationSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 160 },
  developer: { type: String, required: true, trim: true, maxlength: 120 },
  category: { type: String, required: true, trim: true, maxlength: 80 },
  description: { type: String, required: true, trim: true, maxlength: 8000 },
  translator: { type: String, required: true, trim: true, maxlength: 120 },
  version: { type: String, required: true, trim: true, maxlength: 40 },
  status: { type: String, required: true, trim: true, maxlength: 60 },
  progress: { type: Number, min: 0, max: 100, default: 0 },
  downloadUrl: { type: String, required: true, trim: true, maxlength: 2000 },
  githubUrl: { type: String, default: "", trim: true, maxlength: 2000 },
  imageUrl: { type: String, required: true, trim: true, maxlength: 2000 },
  platforms: [{ type: String, trim: true, maxlength: 40 }],
  releaseDate: { type: Date, required: true },
  downloads: { type: Number, min: 0, default: 0 },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  ratingCount: { type: Number, min: 0, default: 0 },
  comments: { type: [commentSchema], default: [] }
}, { timestamps: true });

translationSchema.set("toJSON", {
  transform(_doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    if (ret.releaseDate) ret.releaseDate = new Date(ret.releaseDate).toISOString().split("T")[0];
    if (Array.isArray(ret.comments)) {
      ret.comments = ret.comments.map(comment => ({
        ...comment,
        id: comment._id?.toString(),
        _id: undefined,
        date: comment.date ? new Date(comment.date).toISOString().split("T")[0] : ""
      }));
    }
    return ret;
  }
});

module.exports = mongoose.model("Translation", translationSchema);
