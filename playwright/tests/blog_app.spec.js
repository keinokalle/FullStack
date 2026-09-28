const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, addBlog, logOut } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'other person',
        username: 'other',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
  })

  describe('Login', () => {
    test('fails with wrong credentials', async ({ page }) => {
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('wrong')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('wrong username or password')).toBeVisible()
    })

    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('blogs')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await addBlog(page, 'test title', 'test author', 'test url')

      await expect(page.getByText('A new blog "test title" by test author added')).toBeVisible()

      await page.getByRole('button', { name: 'new blog' }).click()
      await expect(page.getByPlaceholder('write title here')).toHaveValue('')
      await expect(page.getByPlaceholder('write author here')).toHaveValue('')
      await expect(page.getByPlaceholder('write url here')).toHaveValue('')
    })

    test('a blog can be liked', async ({ page }) => {
      await addBlog(page, 'title1', 'author1', 'url1')

      const blog = page.getByText('title1, author1')
      await blog.getByRole('button', { name: 'view' }).click()
      await expect(page.getByText('likes: 0')).toBeVisible()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes: 1')).toBeVisible()
    })

    test('a blog can be deleted', async ({ page }) => {
      await addBlog(page, 'title1', 'author1', 'url1')

      page.once('dialog', dialog => dialog.accept())
      const blog = page.getByText('title1, author1')
      await blog.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByText('title1, author1')).not.toBeVisible()
    })

    test('cannot remove others blogs', async ({ page }) => {
      await logOut(page)
      await loginWith(page, 'other', 'salainen')
      await addBlog(page, 'title2', 'author2', 'url2')
      await logOut(page)
      await loginWith(page, 'mluukkai', 'salainen')

      const blog = page.getByText('title2, author2')
      await blog.getByRole('button', { name: 'view' }).click()
      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })

    test('blogs are ordered according to likes, most likes first', async ({ page }) => {
      await addBlog(page, 'least liked', 'author', 'url1')
      await addBlog(page, 'most liked', 'author', 'url2')

      const mostLiked = page.getByText('most liked, author')
      await mostLiked.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes: 1')).toBeVisible()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes: 2')).toBeVisible()

      const blogHeadings = page.getByRole('heading', { level: 4 })
      await expect(blogHeadings.nth(0)).toContainText('most liked')
      await expect(blogHeadings.nth(1)).toContainText('least liked')
    })
  })
})
