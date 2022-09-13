import { scrumApi } from './scrumApi'
import { Issue } from './types'

const issuesEndpoints = scrumApi.injectEndpoints({
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
      invalidatesTags: ['Issue'],
    }),
    updateIssue: build.mutation<Issue, Partial<Issue>>({
      query: ({ id, ...body }) => ({
        url: `/issues/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Issue'],
    }),
  }),
  overrideExisting: true,
})

// eslint-disable-next-line import/prefer-default-export
export const {
  useGetIssuesQuery,
  useGetIssueByIdQuery,
  useAddIssueMutation,
  useUpdateIssueMutation,
} = issuesEndpoints
