const mongoose = require('mongoose')
const reviewSchema = new mongoose.Schema({
  bookTitle: { type: String, required: true },
  authorName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  reviewText: { type: String, required: true },
  reviewDate: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})
module.exports = mongoose.model('Review', reviewSchema)
