import _ from 'lodash'
import { scrumApi } from './scrumApi'
import { Issue, IssueStatus, Sprint } from './types'

export interface UpdateIssuesBody {
  issues: Partial<Issue> & Pick<Issue, 'id'>[]
}

export interface BoardColumnsData {
  boardColumns: BoardColumns
  sprint: Sprint
}

export interface BoardColumns {
  [x: string]: BoardColumn
}

export interface BoardColumn {
  status: IssueStatus
  name: string
  issues: Issue[]
}

const issuesEndpoints = scrumApi.injectEndpoints({
  endpoints: (build) => ({
    getIssues: build.query<Issue[], void>({
      query: () => '/issues',
      providesTags: [{ type: 'Issue', id: 'LIST' }],
    }),
    getIssuesByToken: build.query<Issue[], void>({
      query: () => '/issues/me',
      providesTags: [{ type: 'Issue', id: 'LIST' }],
    }),
    getBacklog: build.query<Issue[], void>({
      query: () => '/issues/backlog',
      providesTags: [{ type: 'Issue', id: 'LIST' }],
    }),
    getIssuesForBoard: build.query<BoardColumns, void>({
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
      providesTags: [{ type: 'Issue', id: 'LIST' }],
    }),
    getIssueById: build.query<Issue, string>({
      query: (id) => `/issues/${id}`,
      providesTags: (result, error, id) => [{ type: 'Issue' as const, id }],
      keepUnusedDataFor: 0,
    }),
    addIssue: build.mutation<
      Issue,
      Omit<Issue, 'id' | 'createdAt' | 'updatedAt' | 'authorId' | 'storyPoints'>
    >({
      query: (body) => ({
        url: '/issues',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Issue', id: 'LIST' }],
    }),
    updateIssue: build.mutation<Issue, Partial<Issue> & Pick<Issue, 'id'>>({
      query: ({ id, ...body }) => ({
        url: `/issues/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Issue', id: arg.id },
        { type: 'Issue', id: 'LIST' },
      ],
    }),
    updateIssues: build.mutation<void, UpdateIssuesBody>({
      query: (body) => ({
        url: '/issues/me',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [{ type: 'Issue', id: 'LIST' }],
    }),
    deleteIssue: build.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/issues/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Issue', id: arg },
        { type: 'Issue', id: 'LIST' },
      ],
    }),
  }),
  overrideExisting: false,
})

// eslint-disable-next-line import/prefer-default-export
export const {
  useGetIssuesQuery,
  useGetIssuesByTokenQuery,
  useGetBacklogQuery,
  useGetIssuesForBoardQuery,
  useGetIssueByIdQuery,
  useAddIssueMutation,
  useUpdateIssueMutation,
  useUpdateIssuesMutation,
  useDeleteIssueMutation,
} = issuesEndpoints
