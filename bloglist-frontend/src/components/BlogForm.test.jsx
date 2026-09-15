import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {

  const createPlog = vi.fn()
  beforeEach(() => {
    render(
      <BlogForm createBlog={createPlog}/>
    )
  })

  test('Create plog is requested with right body', async () => {
    const titleField = screen.getByPlaceholderText('write title here')
    const authorField = screen.getByPlaceholderText('write author here')
    const urlField = screen.getByPlaceholderText('write url here')
    const sendButton = screen.getByText('create')

    const user = userEvent.setup()
    await user.type(titleField, 'TestTitle')
    await user.type(authorField, 'TestAuthor')
    await user.type(urlField, 'TestUrl')

    await user.click(sendButton)

    expect(createPlog.mock.calls).toHaveLength(1)
    console.log(createPlog.mock.calls)
    expect(createPlog.mock.calls[0][0]).toStrictEqual({title: 'TestTitle', author: 'TestAuthor', url: 'TestUrl'})
  })
})
