const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

// Helper function for routes that need authentication
const requireAuth = [middleware.userExtractor]

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

// Use the helper for routes that need authentication
blogsRouter.post('/', ...requireAuth, async (request, response) => {
  const { title, url } = request.body

  if (!title || !url) {
    return response.status(400).json({ error: 'title or url missing' })
  }

  if (!request.user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = new Blog({
    title: title,
    author: request.body.author || '',
    url: url,
    user: request.user._id,
  })

  const savedBlog = await blog.save()

  // Add the blog to the user's blogs array
  request.user.blogs = request.user.blogs.concat(savedBlog._id)
  await request.user.save()

  // Populate the user information before sending response
  const populatedBlog = await Blog.findById(savedBlog._id).populate('user', {
    username: 1,
    name: 1,
  })

  response.status(201).json(populatedBlog)
})

blogsRouter.delete('/:id', ...requireAuth, async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  // Check if the user is the creator of the blog
  if (blog.user.toString() !== request.user.id.toString()) {
    return response
      .status(403)
      .json({ error: 'not authorized to delete this blog' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response, next) => {
  const { title, author, url, likes } = request.body

  try {
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
      return response.status(404).end()
    }
    blog.title = title
    blog.author = author
    blog.url = url
    blog.likes = likes

    const updatedBlog = await blog.save()
    response.json(updatedBlog)
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter
