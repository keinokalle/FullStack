import Blog from './Blog'
import { Link } from 'react-router-dom'

const BlogList = ({user, blogs, updateBlogLikes, notify}) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const headingBlog = {
    margin: 10,
    marginLeft: 0,
    marginTop: 0
  }

  return(
    <div>
      <h2>blogs</h2>
      {user ? <p>{user.name} logged-in </p> : null}
      <div >
        {blogs.map(blog =>
          <div style={blogStyle} key={blog.id}>
            <h4 style={headingBlog}>
              {blog.title}, {blog.author}
            </h4>
            <Link to={`/blogs/${blog.id}`}><button>Show</button></Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogList
