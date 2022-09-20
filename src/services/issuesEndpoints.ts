import _, { Dictionary } from 'lodash'
import { scrumApi } from './scrumApi'
import { Issue } from './types'

export interface UpdateIssuesBody {
  issues: Partial<Issue> & Pick<Issue, 'id'>[]
}

const issuesEndpoints = scrumApi.injectEndpoints({
  endpoints: (build) => ({
    getIssues: build.query<Issue[], void>({
      query: () => '/issues',
      providesTags: ['Issue'],
    }),
    getIssuesByToken: build.query<Dictionary<Issue[]>, void>({
      query: () => '/issues/me',
      transformResponse: (response: Issue[]) => {
        const sorted = _.orderBy(response, ['boardOrder'], ['asc'])
        return _.groupBy(sorted, 'status')
      },
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
    updateIssues: build.mutation<void, UpdateIssuesBody>({
      query: (body) => ({
        url: '/issues/me',
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
  useUpdateIssuesMutation,
} = issuesEndpoints
