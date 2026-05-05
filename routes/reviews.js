const express = require('express')
const Review = require('../models/review')
const router = express.Router()
function ensureLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next()
  res.redirect('/login')
}
router.get('/reviews', ensureLoggedIn, async (req, res) => {
  const reviews = await Review.find().populate('user')
  res.render('reviews', { reviews })
})
router.get('/review/new', ensureLoggedIn, (req, res) => {
  res.render('review-new', { error: null })
})
router.post('/review', ensureLoggedIn, async (req, res) => {
  const { bookTitle, authorName, rating, reviewText } = req.body
  if (!bookTitle || !authorName || !rating || !reviewText) {
    return res.render('review-new', { error: 'All fields are required' })
  }
  if (isNaN(rating) || rating < 1 || rating > 5) {
    return res.render('review-new', { error: 'Rating must be between 1 and 5' })
  }
  const review = new Review({ bookTitle, authorName, rating: parseInt(rating), reviewText, user: req.user.id })
  await review.save()
  res.redirect('/reviews')
})
router.get('/reviews/:id', ensureLoggedIn, async (req, res) => {
  const review = await Review.findById(req.params.id).populate('user')
  res.render('review-show', { review })
})
router.get('/reviews/:id/edit', ensureLoggedIn, async (req, res) => {
  const review = await Review.findById(req.params.id)
  if (!review) return res.status(404).render('404')
  if (review.user.toString() !== req.user.id) {
    return res.status(403).send('You do not have permission to edit this review')
  }
  res.render('review-edit', { review, error: null })
})
router.put('/reviews/:id', ensureLoggedIn, async (req, res) => {
  const { authorName, rating, reviewText } = req.body
  if (!authorName || !rating || !reviewText) {
    const review = await Review.findById(req.params.id)
    return res.render('review-edit', { review, error: 'All fields are required' })
  }
  if (isNaN(rating) || rating < 1 || rating > 5) {
    const review = await Review.findById(req.params.id)
    return res.render('review-edit', { review, error: 'Rating must be between 1 and 5' })
  }
  const review = await Review.findById(req.params.id)
  if (review.user.toString() !== req.user.id) {
    return res.status(403).send('You do not have permission to update this review')
  }
  await Review.findByIdAndUpdate(req.params.id, { authorName, rating: parseInt(rating), reviewText })
  res.redirect(`/reviews/${req.params.id}`)
})
router.delete('/reviews/:id', ensureLoggedIn, async (req, res) => {
  const review = await Review.findById(req.params.id)
  if (review.user.toString() !== req.user.id) {
    return res.status(403).send('You do not have permission to delete this review')
  }
  await Review.findByIdAndDelete(req.params.id)
  res.redirect('/reviews')
})
module.exports = router
