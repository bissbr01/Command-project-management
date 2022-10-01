import _, { Dictionary } from 'lodash'
import { scrumApi } from './scrumApi'
import { Issue, IssueStatus } from './types'

export interface UpdateIssuesBody {
  issues: Partial<Issue> & Pick<Issue, 'id'>[]
}

export interface BoardColumns {
  [x: string]: {
    status: IssueStatus
    name: string
    issues: Issue[]
  }
}

const issuesEndpoints = scrumApi.injectEndpoints({
  endpoints: (build) => ({
    getIssues: build.query<Issue[], void>({
      query: () => '/issues',
      providesTags: ['Issue'],
    }),
    getIssuesByToken: build.query<BoardColumns, void>({
      query: () => '/issues/me',
      transformResponse: (response: Issue[]) => {
        const sorted = _.orderBy(response, ['boardOrder'], ['asc'])
        const issues = _.groupBy(sorted, 'status')
        const boardColumns: BoardColumns = {
          [IssueStatus.Todo]: {
            status: IssueStatus.Todo,
            name: 'To do',
            issues: issues?.todo ?? [],
          },
          [IssueStatus.InProgress]: {
            status: IssueStatus.InProgress,
            name: 'In Progress',
            issues: issues?.inProgress ?? [],
          },
          [IssueStatus.Done]: {
            status: IssueStatus.Done,
            name: 'Done',
            issues: issues?.done ?? [],
          },
        }
        return boardColumns
      },
      providesTags: ['Issue'],
    }),
    getIssueById: build.query<Issue, string>({
      query: (id) => `/issues/${id}`,
      providesTags: ['Issue'],
    }),
    addIssue: build.mutation<
      Issue,
      Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'authorId'>
    >({
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
    deleteIssue: build.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/issues/${id}`,
        method: 'DELETE',
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
  useDeleteIssueMutation,
} = issuesEndpoints
