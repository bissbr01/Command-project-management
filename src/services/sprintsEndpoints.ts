import _ from 'lodash'
import { scrumApi } from './scrumApi'
import {
  IssueStatus,
  Sprint,
  BoardColumnsData,
  BacklogLists,
  BacklogList,
} from './types'
import { buildQueryString, SprintQueryParams, QueryParams } from './util'

const sprintsEndpoints = scrumApi.injectEndpoints({
  endpoints: (build) => ({
    getSprints: build.query<Sprint[], SprintQueryParams>({
      query: (query) => buildQueryString('/sprints', query),
      providesTags: ['Sprint', { type: 'Issue', id: 'LIST' }],
    }),
    getBacklog: build.query<BacklogList, QueryParams>({
      query: (query) => buildQueryString('/sprints/backlog', query),
      transformResponse: (sprint: Sprint) => {
        const sorted = _.orderBy(sprint.issues, ['boardOrder'], ['asc'])
        const backlogList = {
          name: 'Backlog',
          issues: sorted,
          sprint,
        }
        return backlogList
      },
      providesTags: (result) => [
        { type: 'Sprint', id: result?.sprint?.id },
        { type: 'Issue', id: 'LIST' },
      ],
    }),
    getSprintsForBacklog: build.query<BacklogLists, SprintQueryParams>({
      query: (query) => buildQueryString('/sprints', query),
      transformResponse: (sprints: Sprint[]) => {
        const backlogLists: BacklogLists = {}
        sprints.forEach((sprint) => {
          const sorted = _.orderBy(sprint.issues, ['boardOrder'], ['asc'])
          backlogLists[`Sprint ${sprint.id}`] = {
            name: sprint.name,
            issues: sorted,
            sprint,
          }
        })
        return backlogLists
      },
      providesTags: ['Sprint', { type: 'Issue', id: 'LIST' }],
    }),
    getSprintById: build.query<Sprint, string>({
      query: (id) => `/sprints/${id}`,
      providesTags: (result, error, id) => [{ type: 'Sprint', id }],
    }),
    getSprintForBoard: build.query<
      BoardColumnsData,
      Pick<SprintQueryParams, 'projectId'>
    >({
      query: (query) => buildQueryString('/sprints/board', query),
      transformResponse: (sprint: Sprint) => {
        const sorted = _.orderBy(sprint.issues, ['boardOrder'], ['asc'])
        const issues = _.groupBy(sorted, 'status')
        const boardColumnsData = {
          sprint,
          boardColumns: {
            [IssueStatus.Todo]: {
              status: IssueStatus.Todo,
              name: 'To Do',
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
          },
        }
        return boardColumnsData
      },
      providesTags: ['Sprint', { type: 'Issue', id: 'LIST' }],
    }),
    addSprint: build.mutation<
      Sprint,
      Pick<
        Sprint,
        'goal' | 'active' | 'displayOnBoard' | 'isBacklog' | 'projectId'
      >
    >({
      query: (body) => ({
        url: '/sprints',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Sprint'],
    }),
    updateSprint: build.mutation<Sprint, Partial<Sprint> | Pick<Sprint, 'id'>>({
      query: ({ id, ...body }) => ({
        url: `/sprints/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Sprint', id },
        'Sprint',
      ],
    }),
    deleteSprint: build.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/sprints/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Sprint', id: arg },
        'Sprint',
      ],
    }),
  }),
  overrideExisting: false,
})

// eslint-disable-next-line import/prefer-default-export
export const {
  useGetSprintsQuery,
  useLazyGetSprintsQuery,
  useGetSprintsForBacklogQuery,
  useGetSprintByIdQuery,
  useGetBacklogQuery,
  useLazyGetSprintByIdQuery,
  useGetSprintForBoardQuery,
  useAddSprintMutation,
  useUpdateSprintMutation,
  useDeleteSprintMutation,
} = sprintsEndpoints
