import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import blogService from '../services/blogs'

vi.mock('../services/blogs', () => ({
  default: {
    update: vi.fn(),
    remove: vi.fn(),
  },
}))

describe('<Blog />', () => {
  const mockHandler = vi.fn()

  beforeEach(() => {
    mockHandler.mockClear()
    blogService.update.mockResolvedValue({
      title: 'Testiblogi',
      author: 'Kalle',
      url: 'testi.fi',
      likes: 1,
      user: { name: 'testName', username: 'testUserName' },
    })

    const testUser = {
      name: 'testName',
      userName: 'testUserName'
    }

    const blog = {
      title: 'Testiblogi',
      author: 'Kalle',
      url: 'testi.fi',
      likes: 0,
      user: testUser
    }
    render(
      <Blog blog={blog} updateBlogLikes={mockHandler}/>
    )
  })

  test('Renders blogs title', () => {
    screen.getByText('Testiblogi', {exact: false})
  })

  test('Shows url, likes and user when clicked', async () => {
    const showButton = screen.getByText('view')

    const user = userEvent.setup()
    await user.click(showButton)

    screen.getByText('url: testi.fi')
    screen.getByText('added by: testName')
    screen.getByText('likes: 0')
  })

  test('Like button is pressed twice', async () => {
    const showButton = screen.getByText('view')

    const user = userEvent.setup()
    await user.click(showButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
