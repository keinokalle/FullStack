import { useState, useEffect, useRef } from 'react'
import loginService from './services/login'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
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
      console.log(window.localStorage.length);
      

      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const addBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      blogFormRef.current.toggleVisibility()
      setErrorMessage(`A new blog "${returnedBlog.title}" by ${returnedBlog.author} added`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('Error creating blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  //const updateBlog = async (blogObject)

  const loginForm = () => (
    <div>
      <h2>log in to application</h2>
      <Notification message={errorMessage} />
      <form onSubmit={handleLogin}>
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
            />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
            />
        </div>
        <button type="submit">login</button>
      </form>      
    </div>
  )

  const blogsView = () => (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} />
      <div>
        <p>{user.name} logged-in <button onClick={handleLogout}>logout</button></p>
        <Togglable buttonLabel="new blog" ref={blogFormRef}>
          <BlogForm createBlog={addBlog} />
        </Togglable>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    </div>
  )

  return (
    <div>
      {user === null ? loginForm() : blogsView()}
    </div>
  )
}

export default App