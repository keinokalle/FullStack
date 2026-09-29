import { useState } from 'react'
import { TextField, Button } from '@mui/material'
import styled from 'styled-components'

const InputDiv = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 200px;
  gap: 20px;
`

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
        <InputDiv>
          <TextField
            variant='outlined'          
            type="text"
            value={title}
            aria-label="Title"
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
            placeholder='write title here'
          />
        
          <TextField
            variant='outlined'
            type="text"
            value={author}
            aria-label="Author"
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
            placeholder='write author here'
          />
        
          <TextField
            variant='outlined'
            type="text"
            value={url}
            aria-label="Url"
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
            placeholder='write url here'
          />
        
          <Button variant="contained" type="submit">create</Button>
        </InputDiv>
      </form>
    </div>
  )
}

export default BlogForm