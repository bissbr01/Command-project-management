// /* eslint-disable react/jsx-filename-extension */
// import React from 'react'
// import '@testing-library/jest-dom'
// import { render, screen } from '@testing-library/react'
// import userEvent from '@testing-library/user-event'
// import Blog from '../components/Blog'

// describe('Blog component renders correctly', () => {
//   const updateBlog = jest.fn()
//   const deleteBlog = jest.fn()
//   const blogUser = {
//     username: 'Tesla10',
//     name: 'Joe Schmoe',
//     token: 'tokenstring',
//   }
//   const blog = {
//     id: '12345asdf',
//     title: 'The Champer of Secrets',
//     author: 'Albus Dumbledore',
//     url: 'www.test.com',
//     likes: '2',
//     user: {
//       id: '12345asdff',
//       username: blogUser.username,
//       name: blogUser.name,
//     },
//   }

//   screen.debug()

//   it('displays title and author on render, but not other properties', () => {
//     render(
//       <Blog
//         key={12345}
//         user={blogUser}
//         blog={blog}
//         updateBlog={updateBlog}
//         deleteBlog={deleteBlog}
//       />
//     )
//     screen.getByText(`${blog.title}`)
//     expect(screen.queryByText(`Author: ${blog.author}`)).not.toBeVisible()
//     expect(screen.queryByText(`Url: ${blog.url}`)).not.toBeVisible()
//     expect(screen.queryByText(`Likes: ${blog.likes}`)).not.toBeVisible()
//   })

//   it('displays all Blog properties after "details" button is pressed', async () => {
//     render(
//       <Blog
//         key={12345}
//         user={blogUser}
//         blog={blog}
//         updateBlog={updateBlog}
//         deleteBlog={deleteBlog}
//       />
//     )

//     const user = userEvent.setup()
//     const detailsButton = screen.getByText('details')
//     await user.click(detailsButton)

//     expect(screen.queryByText(`Author: ${blog.author}`)).toBeVisible()
//     expect(screen.queryByText(`Url: ${blog.url}`)).toBeVisible()
//     expect(screen.queryByText(`Likes: ${blog.likes}`)).toBeVisible()
//   })

//   it('calls updateBlog 2x when Likes button is clicked 2x', async () => {
//     render(
//       <Blog
//         key={12345}
//         user={blogUser}
//         blog={blog}
//         updateBlog={updateBlog}
//         deleteBlog={deleteBlog}
//       />
//     )
//     const user = userEvent.setup()

//     const likeButton = screen.getByText('Like')
//     await user.click(likeButton)
//     await user.click(likeButton)

//     expect(updateBlog.mock.calls[0][0].likes).toBe(blog.likes)
//     expect(updateBlog.mock.calls[1][0].likes).toBe(blog.likes)
//   })
// })
