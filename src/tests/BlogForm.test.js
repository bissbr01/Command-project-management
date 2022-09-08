// /* eslint-disable react/jsx-filename-extension */
// import React from 'react'
// import '@testing-library/jest-dom'
// import { render, screen } from '@testing-library/react'
// import userEvent from '@testing-library/user-event'
// import BlogForm from '../components/BlogForm'

// test('<BlogForm /> updates parent state and calls onSubmit', async () => {
//   const createBlog = jest.fn()
//   const user = userEvent.setup()

//   render(<BlogForm addBlog={createBlog} />)

//   const inputs = screen.getAllByRole('textbox')
//   const title = inputs[0]
//   const author = inputs[1]
//   const url = inputs[2]
//   const likes = inputs[3]
//   const sendButton = screen.getByText('Save')

//   const blog = {
//     title: 'The Champer of Secrets',
//     author: 'Albus Dumbledore',
//     url: 'www.test.com',
//     likes: '2',
//   }

//   await user.type(title, blog.title)
//   await user.type(author, blog.author)
//   await user.type(url, blog.url)
//   await user.type(likes, blog.likes)
//   await user.click(sendButton)

//   expect(createBlog.mock.calls).toHaveLength(1)
//   expect(createBlog.mock.calls[0][0].title).toBe(blog.title)
//   expect(createBlog.mock.calls[0][0].author).toBe(blog.author)
//   expect(createBlog.mock.calls[0][0].url).toBe(blog.url)
//   // expect(createBlog.mock.calls[0][0].likes).toBe(blog.likes);
// })
