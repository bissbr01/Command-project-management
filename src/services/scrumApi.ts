// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Issue } from './types'

const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://scrum-management-backend.herokuapp.com/api'
    : 'http://localhost/3001/api'
// Define a service using a base URL and expected endpoints
export const scrumApi = createApi({
  reducerPath: 'scrumApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    // headers: { authorization: `Bearer ${TOKEN}` },
  }),
  endpoints: (builder) => ({
    getIssueById: builder.query<Issue, string>({
      query: (id) => `issues/${id}`,
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetIssueByIdQuery } = scrumApi
