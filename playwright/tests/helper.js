const loginWith = async (page, username, password) => {
  await page.goto('http://localhost:5173/login')
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
  await page.getByRole('button', { name: 'logout' }).waitFor()
}

const logOut = async (page) => {
  await page.getByRole('button', { name: 'logout' }).click()
  await page.getByRole('button', { name: 'login' }).waitFor()
}

const addBlog = async (page, title, author, url) => {
  await page.goto('http://localhost:5173/create')
  await page.getByPlaceholder('write title here').fill(title)
  await page.getByPlaceholder('write author here').fill(author)
  await page.getByPlaceholder('write url here').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  await page.getByText(`A new blog "${title}" by ${author} added`).waitFor()
}

module.exports = {
  loginWith,
  addBlog,
  logOut
}
