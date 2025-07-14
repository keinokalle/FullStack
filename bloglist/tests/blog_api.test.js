const assert = require('node:assert')
const { test, describe, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

let testToken

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  // Create users first
  for (const u of helper.initialUsers) {
    await api.post('/api/users').send(u)
  }

  // Get the first user to create blogs with
  const users = await helper.usersInDb()
  const firstUser = users[0]

  // Create blogs with user information
  await helper.createBlogsWithUser(helper.initialBlogs, firstUser)

  // Create a test user and get token for authenticated tests
  const newUser = {
    username: 'testuser',
    name: 'Test User',
    password: 'password123',
  }

  await api.post('/api/users').send(newUser)

  // Login to get token
  const loginResponse = await api
    .post('/api/login')
    .send({
      username: 'testuser',
      password: 'password123',
    })
    .expect(200)

  testToken = loginResponse.body.token
})

describe('blog tests', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('returns the right amount of blogs', async() => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('identity is id, not _id', async () => {
    const response = await api.get('/api/blogs')
    // Check that every blog has 'id' property and does not have '_id'
    response.body.forEach(blog => {
      assert.ok(blog.id, 'Blog should have an id property')
      assert.strictEqual(blog._id, undefined, 'Blog should not have _id property')
    })
  })

  test('adding new blogs works with valid token', async() => {
    const newBlog = {
      title: 'String',
      author: 'String',
      url: 'String',
      likes: 2,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${testToken}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const contents = blogsAtEnd.map(b => b.title)
    assert(contents.includes('String'))
  })

  test('adding new blogs fails without token', async() => {
    const newBlog = {
      title: 'String',
      author: 'String',
      url: 'String',
      likes: 2,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)
  })


  test('if no likes are added the default 0 is added', async() => {
    const newBlog = {
      title: 'String',
      author: 'String',
      url: 'String',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${testToken}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const blog = blogsAtEnd[blogsAtEnd.length - 1]

    assert.strictEqual(blog.likes, 0)
  })

  test('if no title || url, responds with status 400 Bad Request', async() => {
    const falsyBlog = {
      title: 'String',
      author: 'String',
      likes: 2
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${testToken}`)
      .send(falsyBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('delete one blog with valid token', async() => {
    // First create a blog with the authenticated user
    const newBlog = {
      title: 'Blog to delete',
      author: 'Test Author',
      url: 'http://test.com',
    }

    const createdBlog = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${testToken}`)
      .send(newBlog)
      .expect(201)

    const blogToDelete = createdBlog.body

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${testToken}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    const allTitles = blogsAtEnd.map(b => b.title)
    assert(!allTitles.includes(blogToDelete.title))
  })

  test('update one blog', async() => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const updatedData = {
      title: 'Updated Title',
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: blogToUpdate.likes + 1
    }
    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedData)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)
    assert.strictEqual(updatedBlog.title, updatedData.title)
    assert.strictEqual(updatedBlog.likes, updatedData.likes)
  })

  test('blogs contain user information', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach((blog) => {
      assert.ok(blog.user, 'Blog should have user information')
      assert.ok(blog.user.username, 'Blog should have user username')
      assert.ok(blog.user.name, 'Blog should have user name')
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})