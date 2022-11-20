import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../store'

const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://scrum-management-backend.onrender.com/api'
    : 'http://localhost:3001/api'
// Define a service using a base URL and expected endpoints
export const scrumApi = createApi({
  reducerPath: 'scrumApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const { token } = (getState() as RootState).auth
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }

      return headers
    },
  }),
  tagTypes: [
    'Comment',
    'Issue',
    'Sprint',
    'Project',
    'User',
    'Team',
    'Notification',
  ],
  endpoints: () => ({}),
})
