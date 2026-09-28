const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, addBlog, logOut } = require('./helper')

describe('Blog app', () => {
  const openBlogFromList = async (page, title, author) => {
    await page.goto('http://localhost:5173/blogs')
    const blogHeading = page.getByRole('heading', { name: `${title}, ${author}` })
    await expect(blogHeading).toBeVisible()
    await blogHeading.locator('xpath=..').getByRole('button', { name: 'Show' }).click()
  }

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

  describe('Login', () => {
    test('fails with wrong credentials', async ({ page }) => {
      await page.goto('http://localhost:5173/login')
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('wrong')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('wrong username or password')).toBeVisible()
    })

    test('succeeds with correct credentials', async ({ page }) => {
      await page.goto('http://localhost:5173/login')
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('login successful'))
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await addBlog(page, 'test title', 'test author', 'test url')
      await expect(page.getByText('A new blog "test title" by test author added')).toBeVisible()

      await expect(page.getByPlaceholder('write title here')).toHaveValue('')
      await expect(page.getByPlaceholder('write author here')).toHaveValue('')
      await expect(page.getByPlaceholder('write url here')).toHaveValue('')
    })

    test('a blog can be liked', async ({ page }) => {
      await addBlog(page, 'title1', 'author1', 'url1')

      await openBlogFromList(page, 'title1', 'author1')
      await expect(page.getByText('likes: 0')).toBeVisible()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes: 1')).toBeVisible()
    })

    test('a blog can be deleted', async ({ page }) => {
      await addBlog(page, 'title1', 'author1', 'url1')

      page.once('dialog', dialog => dialog.accept())
      await openBlogFromList(page, 'title1', 'author1')
      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByText('title1, author1')).not.toBeVisible()
    })
  })
})
