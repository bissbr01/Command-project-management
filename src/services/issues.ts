// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { Issue } from './types'

// Define a service using a base URL and expected endpoints
export const scrumApi = createApi({
  reducerPath: 'scrumApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2/' }),
  endpoints: (builder) => ({
    getIssueById: builder.query<Issue, string>({
      query: (id) => `issues/${id}`,
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetIssueByIdQuery } = scrumApi
