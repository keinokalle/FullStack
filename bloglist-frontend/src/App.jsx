import { useState, useEffect, useRef } from 'react'
import loginService from './services/login'
import Blog from './components/Blog'
import BlogList from './components/BlogList'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import Notification from './components/Notification'
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'
import Blogs from './services/blogs'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const notify = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a, b) => b.likes - a.likes) )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      console.log(window.localStorage.length)


      setUser(user)
      setUsername('')
      setPassword('')

      blogService.setToken(user.token)
      notify('login successful', 'success')
    } catch (exception) {
      notify('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs([...blogs, returnedBlog].sort((a, b) => b.likes - a.likes))
      
      notify(`A new blog "${returnedBlog.title}" by ${returnedBlog.author} added`, 'success')
    } catch (exception) {
      notify('Error creating blog', 'error')
    }
  }

  const updateBlogLikes = (updatedBlogOrId) => {
    if (typeof updatedBlogOrId === 'string') {
      // It's a blog id, so remove the blog
      setBlogs(blogs.filter(blog => blog.id !== updatedBlogOrId))
    } else {
      // It's a blog object, so update it
      setBlogs(
        blogs
          .map(blog => blog.id === updatedBlogOrId.id ? updatedBlogOrId : blog)
          .sort((a, b) => b.likes - a.likes)
      )
    }
  }

  //const updateBlog = async (blogObject)

  const loginForm = () => (
    <div>
      <h2>log in to application</h2>
      <form onSubmit={handleLogin}>
        <label>
          username
          <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
        <label>
          password
          <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
        <button type="submit">login</button>
      </form>
    </div>
  )

  const padding = {
    padding: 5
  }

  return (
    <div>
      <Notification notification={notification} />
      <Router>
        <div>
          <Link style={padding} to="/blogs">blogs</Link>
          <Link style={padding} to="/create">new blog</Link>
          {user === null ? <Link style={padding} to="/login">login</Link> : <button onClick={handleLogout}>logout</button>}
        </div>

        <Routes>
          <Route path="/" element={
            <BlogList user={user} blogs={blogs} updateBlogLikes={updateBlogLikes} notify={notify} />
          } />
          <Route path="/blogs" element={
            <BlogList user={user}  blogs={blogs}  />
          } />
          <Route path="/blogs/:id" element={
            <Blog 
              blogs={blogs}
              updateBlogLikes={updateBlogLikes} 
              notify={notify}
              user={user}
            />
          } />
          <Route path="/create" element={
            <BlogForm createBlog={addBlog} />
            } />
          <Route path="/login" element={
            loginForm()
          } />
        </Routes>
      </Router>   
    </div>
  )
}

export default App