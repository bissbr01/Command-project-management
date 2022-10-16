import _ from 'lodash'
import { BoardColumnsData } from './issuesEndpoints'
import { scrumApi } from './scrumApi'
import { Issue, IssueStatus, Sprint } from './types'

interface SprintQueryParams {
  active?: boolean
  search?: string
}

export type BacklogList = {
  name: string
  issues: Issue[]
  sprint: Sprint | null
}

export type BacklogLists = Map<string, BacklogList>

const sprintsEndpoints = scrumApi.injectEndpoints({
  endpoints: (build) => ({
    getSprints: build.query<Sprint[], SprintQueryParams>({
      query: (query) => `/sprints?active=${query?.active}`,
      providesTags: ['Sprint', { type: 'Issue', id: 'LIST' }],
    }),
    getSprintsForBacklog: build.query<BacklogLists, SprintQueryParams>({
      query: (query) => `/sprints?active=${query?.active}`,
      transformResponse: (sprints: Sprint[]) => {
        const backlogLists = new Map<string, BacklogList>()
        sprints.forEach((sprint) => {
          const sorted = _.orderBy(sprint.issues, ['boardOrder'], ['asc'])
          backlogLists.set(`Sprint ${sprint.id}`, {
            name: `Sprint ${sprint.id}`,
            issues: sorted,
            sprint,
          })
        })
        return backlogLists
      },
      providesTags: ['Sprint', { type: 'Issue', id: 'LIST' }],
    }),
    getSprintById: build.query<Sprint, string>({
      query: (id) => `/sprints/${id}`,
      providesTags: (result, error, id) => [{ type: 'Sprint', id }],
    }),
    getSprintForBoard: build.query<BoardColumnsData, void>({
      query: () => 'sprints/board',
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
      Omit<Sprint, 'id' | 'author' | 'project'>
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
  useGetSprintsForBacklogQuery,
  useGetSprintByIdQuery,
  useLazyGetSprintByIdQuery,
  useGetSprintForBoardQuery,
  useAddSprintMutation,
  useUpdateSprintMutation,
  useDeleteSprintMutation,
} = sprintsEndpoints
