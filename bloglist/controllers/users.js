const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  // Validate that username and password are provided
  if (!username || !password) {
    return response.status(400).json({
      error: 'username and password are required',
    })
  }

  // Validate username length
  if (username.length < 3) {
    return response.status(400).json({
      error: 'username must be at least 3 characters long',
    })
  }

  // Validate password length
  if (password.length < 3) {
    return response.status(400).json({
      error: 'password must be at least 3 characters long',
    })
  }

  // Check if username already exists
  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return response.status(400).json({
      error: 'username must be unique',
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  try {
    const savedUser = await user.save()
    response.status(201).json(savedUser)
  } catch (error) {
    if (error.name === 'ValidationError') {
      return response.status(400).json({
        error: error.message,
      })
    }
    response.status(500).json({
      error: 'internal server error',
    })
  }
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { title: 1, author: 1 })
  response.json(users)
})

module.exports = usersRouter
