const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favoriteGenre: { type: String, required: true },
  bio: { type: String, required: true },
  reviewerSince: { type: Date, default: Date.now }
})
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 12)
})
userSchema.methods.validatePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password)
}
module.exports = mongoose.model('User', userSchema)
