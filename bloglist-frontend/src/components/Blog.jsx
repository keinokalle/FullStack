import { useState } from 'react'

const Blog = ({ blog }) => {
  const [showDetails, setShowDetails] = useState(false)

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

  const like = () => {
    const newBlog = {
      ...blog,
      likes: blog.likes + 1
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
            likes: {blog.likes} <button onClick={like}>like</button>
          </div>
          <div>
            added by: {blog.user && blog.user.name ? blog.user.name : 'unknown'}
          </div>
        </div>
      )}
    </div>
  )
}

export default Blog