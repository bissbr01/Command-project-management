// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Issue } from './types'
import type { RootState } from '../store'

const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://scrum-management-backend.herokuapp.com/api'
    : 'http://localhost/3001/api'
// Define a service using a base URL and expected endpoints
export const scrumApi = createApi({
  reducerPath: 'scrumApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const { token } = (getState() as RootState).auth

      // If we have a token set in state, let's assume that we should be passing it.
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }

      return headers
    },
  }),
  tagTypes: ['Comment', 'Issue', 'Sprint', 'Project', 'User'],
  endpoints: (build) => ({
    getIssues: build.query<Issue[], void>({
      query: () => '/issues',
      providesTags: ['Issue'],
    }),
    getIssueById: build.query<Issue, string>({
      query: (id) => `/issues/${id}`,
      providesTags: ['Issue'],
    }),
    addIssue: build.mutation<Issue, Omit<Issue, 'id'>>({
      query: (body) => ({
        url: '/issues',
        method: 'POST',
        body,
      }),
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export default scrumApi
export const { useGetIssuesQuery, useGetIssueByIdQuery } = scrumApi
