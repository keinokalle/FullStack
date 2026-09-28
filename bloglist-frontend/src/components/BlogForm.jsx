import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    createBlog({
      title,
      author,
      url
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <div>
        title
          <input
            type="text"
            value={title}
            aria-label="Title"
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
            placeholder='write title here'
          />
        </div>
        <div>
        author:
          <input
            type="text"
            value={author}
            aria-label="Author"
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
            placeholder='write author here'
          />
        </div>
        <div>
        url:
          <input
            type="text"
            value={url}
            aria-label="Url"
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
            placeholder='write url here'
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm