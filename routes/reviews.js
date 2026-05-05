const express = require('express')
const Review = require('../models/review')
const router = express.Router()

router.get('/reviews', async (req, res) => {
  const reviews = await Review.find()
  res.render('reviews', { reviews })
})

router.get('/review/new', (req, res) => {
  res.render('review-new')
})

router.post('/review', async (req, res) => {
  const review = new Review(req.body)
  await review.save()
  res.redirect('/reviews')
})

router.get('/reviews/:id', async (req, res) => {
  const review = await Review.findById(req.params.id)
  res.render('review-show', { review })
})

router.get('/reviews/:id/edit', async (req, res) => {
  const review = await Review.findById(req.params.id)
  res.render('review-edit', { review })
})

router.put('/reviews/:id', async (req, res) => {
  await Review.findByIdAndUpdate(req.params.id, req.body)
  res.redirect('/reviews')
})

router.delete('/reviews/:id', async (req, res) => {
  await Review.findByIdAndDelete(req.params.id)
  res.redirect('/reviews')
})

module.exports = router
