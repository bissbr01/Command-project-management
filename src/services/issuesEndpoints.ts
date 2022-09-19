import _, { Dictionary } from 'lodash'
import { scrumApi } from './scrumApi'
import { Issue } from './types'

const issuesEndpoints = scrumApi.injectEndpoints({
  endpoints: (build) => ({
    getIssues: build.query<Issue[], void>({
      query: () => '/issues',
      providesTags: ['Issue'],
    }),
    getIssuesByToken: build.query<Dictionary<Issue[]>, void>({
      query: () => '/issues/me',
      transformResponse: (response: Issue[]) => _.groupBy(response, 'status'),
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
    updateIssue: build.mutation<Issue, Partial<Issue> & Pick<Issue, 'id'>>({
      query: ({ id, ...body }) => ({
        url: `/issues/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Issue'],
    }),
  }),
  overrideExisting: false,
})

// eslint-disable-next-line import/prefer-default-export
export const {
  useGetIssuesQuery,
  useGetIssuesByTokenQuery,
  useGetIssueByIdQuery,
  useAddIssueMutation,
  useUpdateIssueMutation,
} = issuesEndpoints
