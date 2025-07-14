const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Pierut haisee',
    author: 'Herra haisuli',
    url: 'String',
    likes: 1,
  },
  {
    title: 'Koirat haukkuu',
    author: 'Herra haukkuli',
    url: 'hs.fi',
    likes: 5,
  },
  {
    title: 'Kukot kiekuu',
    author: 'Kukko kiekuli',
    url: 'kukko.net',
    likes: 4,
  },
  {
    title: 'Kissa maukuu',
    author: 'Maukuva kisuli',
    url: 'grr.fi',
    likes: 15,
  }
]

const initialUsers = [
  {
    username: 'Enkeli',
    name: 'Taivaan henki',
    password: 'salainenEnkeli',
    blogs: []
  },
  {
    username: 'Piru',
    name: 'Helvetin henki',
    password: 'salainenPiru',
    blogs: []
  },
]

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(b => b.toJSON())
}

module.exports = {
  initialBlogs,
  initialUsers,
  usersInDb,
  blogsInDb
}