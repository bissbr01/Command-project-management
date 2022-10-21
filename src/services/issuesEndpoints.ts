import _ from 'lodash'
import { scrumApi } from './scrumApi'
import {
  BoardColumns,
  Issue,
  IssueForUpdate,
  IssueStatus,
  Sprint,
} from './types'
import { buildQueryString, QueryParams } from './util'

const issuesEndpoints = scrumApi.injectEndpoints({
  endpoints: (build) => ({
    getIssues: build.query<Issue[], void>({
      query: () => '/issues',
      providesTags: [{ type: 'Issue', id: 'LIST' }],
    }),
    getIssuesByToken: build.query<Issue[], QueryParams>({
      query: (query) => buildQueryString('/issues/me', query),
      providesTags: [{ type: 'Issue', id: 'LIST' }],
    }),
    getBacklog: build.query<Issue[], QueryParams>({
      query: (query) => buildQueryString('/issues/backlog', query),
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
    updateIssue: build.mutation<Issue, IssueForUpdate>({
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
  useDeleteIssueMutation,
} = issuesEndpoints
