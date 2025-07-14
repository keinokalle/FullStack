const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', (request, response) => {
  response.send('<h1>Bloglist </h1>')
})

blogsRouter.get('/api/blogs', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

blogsRouter.post('/api/blogs', async (request, response) => {
  const { title, url, userId } = request.body

  const user = await User.findById(userId)

  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  if (!title || !url) {
    return response.status(400).json({ error: 'title or url missing' })
  }
  const blog = new Blog({
    title: title,
    author: request.body.author || '',
    url: url,
    user: userId
  })
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)

  await user.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/api/blogs/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/api/blogs/:id', async (request, response, next) => {
  const { title, author, url, likes } = request.body

  try{
    const blog = await Blog.findById(request.params.id)

    if(!blog) {
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