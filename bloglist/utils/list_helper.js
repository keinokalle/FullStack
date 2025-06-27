const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const toReturn = blogs.reduce((sum, blog) => blog.likes + sum, 0)
  console.log(toReturn)
  return toReturn
}

const favoriteBlog = (blogs) => {
  if(blogs.length === 0) return undefined

  return blogs.reduce((maxItem, currentItem) => maxItem.likes > currentItem.likes ? maxItem : currentItem)
}

module.exports = { dummy, totalLikes, favoriteBlog }