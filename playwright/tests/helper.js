const loginWith = async (page, username, password) => {
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
  await page.getByRole('button', { name: 'new blog' }).click()
  await page.getByPlaceholder('write title here').fill(title)
  await page.getByPlaceholder('write author here').fill(author)
  await page.getByPlaceholder('write url here').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
  await page.getByText(`${title}, ${author}`).waitFor()
}

module.exports = {
  loginWith,
  addBlog,
  logOut
}
