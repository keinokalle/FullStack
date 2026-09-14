import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, updateBlogLikes, notify }) => {
  const [showDetails, setShowDetails] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const headingBlog = {
    margin: 10,
    marginLeft: 0,
    marginTop: 0
  }

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }


  const like = async () => {
    const newBlog = {
      ...blog,
      likes: likes + 1,
      user: blog.user && blog.user.id ? blog.user.id : blog.user
    }
    try {
      const updated = await blogService.update(blog.id, newBlog)
      setLikes(likes + 1)
      updateBlogLikes(updated)
    } catch (error) {
      // Optionally handle error, e.g., show a notification
      console.error('Error liking the blog:', error)
    }
  }

  const deleteBlog = async () => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id)
        updateBlogLikes(blog.id)
        notify('Blog deleted successfully', 'success')
      } catch (error) {
        notify('Failed to delete blog post', 'error')
        console.error('Error removing the blog:', error)
      }
    }
  }

  return (
    <div style={blogStyle}>
      <div>
        <h4 style={headingBlog}>
          {blog.title}, {blog.author}
          <button onClick={toggleDetails}>
            {showDetails ? 'hide' : 'view'}
          </button>
        </h4>
      </div>
      {showDetails && (
        <div>
          <div>
            url: {blog.url}
          </div>
          <div>
            likes: {likes} <button onClick={like}>like</button>
          </div>
          <div>
            added by: {blog.user && blog.user.name ? blog.user.name : 'unknown'}
          </div>
          <div>
            {blog.user && blog.user.username === JSON.parse(window.localStorage.getItem('loggedBlogappUser') || '{}').username && (
              <button onClick={deleteBlog}> remove </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Blog