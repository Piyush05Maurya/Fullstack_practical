const express = require('express')
const passport = require('passport')
const User = require('../models/user')
const router = express.Router()
router.get('/register', (req, res) => res.render('register', { error: null }))
router.post('/register', async (req, res) => {
  const { username, password, favoriteGenre, bio } = req.body
  if (!username || !password || !favoriteGenre || !bio) {
    return res.render('register', { error: 'All fields are required' })
  }
  try {
    await User.create({ username, password, favoriteGenre, bio })
    res.redirect('/login')
  } catch (e) {
    res.render('register', { error: 'Username not available' })
  }
})
router.get('/login', (req, res) => {
  const error = req.session.messages ? req.session.messages[0] : null
  if (req.session.messages) delete req.session.messages
  res.render('login', { error })
})
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err)
    if (!user) return res.render('login', { error: 'Invalid username or password' })
    req.logIn(user, (err) => {
      if (err) return next(err)
      res.redirect('/reviews')
    })
  })(req, res, next)
})
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/login')
  })
})
module.exports = router
