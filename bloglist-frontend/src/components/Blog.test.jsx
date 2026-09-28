import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import blogService from '../services/blogs'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

vi.mock('../services/blogs', () => ({
  default: {
    update: vi.fn(),
    remove: vi.fn(),
  },
}))

describe('<Blog />', () => {
  const mockHandler = vi.fn()
  const notify = vi.fn()
  const blog = {
    id: 'blog-id-1',
    title: 'Testiblogi',
    author: 'Kalle',
    url: 'testi.fi',
    likes: 0,
    user: {
      name: 'testName',
      username: 'creatorUser'
    }
  }

  const renderBlog = ({ user = null, loggedUsername = null } = {}) => {
    window.localStorage.clear()
    if (loggedUsername) {
      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify({ username: loggedUsername })
      )
    }

    render(
      <MemoryRouter initialEntries={['/blogs/blog-id-1']}>
        <Routes>
          <Route
            path="/blogs/:id"
            element={
              <Blog
                blogs={[blog]}
                updateBlogLikes={mockHandler}
                notify={notify}
                user={user}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    )
  }

  beforeEach(() => {
    mockHandler.mockClear()
    notify.mockClear()
    window.localStorage.clear()
    blogService.update.mockResolvedValue({
      id: 'blog-id-1',
      title: 'Testiblogi',
      author: 'Kalle',
      url: 'testi.fi',
      likes: 1,
      user: { name: 'testName', username: 'creatorUser' },
    })
  })

  test('Unsigned user sees blog info and likes, but no buttons', () => {
    renderBlog()

    screen.getByText('Testiblogi', { exact: false })
    screen.getByText('url: testi.fi')
    screen.getByText('added by: testName')
    screen.getByText('likes: 0')
    expect(screen.queryByRole('button', { name: 'like' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'remove' })).not.toBeInTheDocument()
  })

  test('Signed in user who is not creator only sees like button', () => {
    renderBlog({
      user: { username: 'otherUser', name: 'Other User' },
      loggedUsername: 'otherUser'
    })

    expect(screen.getByRole('button', { name: 'like' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'remove' })).not.toBeInTheDocument()
  })

  test('Creator sees both like and remove buttons', () => {
    renderBlog({
      user: { username: 'creatorUser', name: 'Creator User' },
      loggedUsername: 'creatorUser'
    })

    expect(screen.getByRole('button', { name: 'like' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'remove' })).toBeInTheDocument()
  })

  test('Like button is pressed twice', async () => {
    renderBlog({
      user: { username: 'creatorUser', name: 'Creator User' },
      loggedUsername: 'creatorUser'
    })

    const user = userEvent.setup()
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})
