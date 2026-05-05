const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const methodOverride = require('method-override')
const User = require('./models/user')
const authRoutes = require('./routes/auth')
const reviewRoutes = require('./routes/reviews')
const MongoStore = require('connect-mongo')
const app = express()
mongoose.connect('mongodb://127.0.0.1:27017/bookreviews')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/bookreviews' })
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username })
    if (!user) return done(null, false)
    const valid = await user.validatePassword(password)
    return valid ? done(null, user) : done(null, false)
  } catch (e) {
    return done(e)
  }
}))
passport.serializeUser((user, done) => done(null, user.id))
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id)
  done(null, user)
})
app.use((req, res, next) => {
  res.locals.currentUser = req.user
  next()
})
app.use('/', authRoutes)
app.use('/', reviewRoutes)
app.get('/', (req, res) => res.redirect('/reviews'))
app.listen(3000)
