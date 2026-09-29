import { useState } from 'react'
import blogService from '../services/blogs'
import { useParams } from 'react-router-dom'
import { Button } from '@mui/material'

const Blog = ({ blogs, updateBlogLikes, notify, user }) => {

  const id = useParams().id
  const blog = blogs.find(b => b.id === id)
  if(!blog) return null

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

  const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8
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
      updateBlogLikes({
        ...updated,
        user: updated.user?.username ? updated.user : blog.user
      })
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
        </h4>
        <div style={rowStyle}>
          url: {blog.url}
        </div>
        <div style={rowStyle}>
          likes: {likes}
          {user ? <Button size="small" variant="contained" onClick={like}>like</Button> : null}
        </div>
        <div style={rowStyle}>
          added by: {blog.user && blog.user.name ? blog.user.name : 'unknown'}
        </div>
        <div style={rowStyle}>
          {user && blog.user && blog.user.username === JSON.parse(window.localStorage.getItem('loggedBlogappUser') || '{}').username && (
            <Button size="small" color="error" variant="outlined" onClick={deleteBlog}>remove</Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Blog