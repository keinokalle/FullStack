const assert = require('node:assert')
const { test, describe, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
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

  test('adding new blogs works', async() => {
    const newBlog = {
      title: 'String',
      author: 'String',
      url: 'String',
      likes: 2,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const contents = blogsAtEnd.map(b => b.title)
    assert(contents.includes('String'))
  })

  test('if no likes are added the default 0 is added', async() => {
    const newBlog ={
      title: 'String',
      author: 'String',
      url: 'String',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const blog = blogsAtEnd[blogsAtEnd.length - 1]

    assert.strictEqual(blog.likes, 0)
  })

  test.only('if no title || url, responds with status 400 Bad Request', async() => {
    const falsyBlog = {
      title: 'String',
      author: 'String',
      likes: 2
    }

    await api
      .post('/api/blogs')
      .send(falsyBlog)
      .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })

  test('delete one blog', async() => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
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

})

after(async () => {
  await mongoose.connection.close()
})