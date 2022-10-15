import _ from 'lodash'
import { BoardColumns, BoardColumnsData } from './issuesEndpoints'
import { scrumApi } from './scrumApi'
import { IssueStatus, Sprint } from './types'

interface SprintQueryParams {
  active?: boolean
  search?: string
}

const sprintsEndpoints = scrumApi.injectEndpoints({
  endpoints: (build) => ({
    getSprints: build.query<Sprint[], SprintQueryParams>({
      query: (query) => `/sprints?active=${query?.active}`,
      providesTags: ['Sprint'],
    }),
    getSprintById: build.query<Sprint, string>({
      query: (id) => `/sprints/${id}`,
      providesTags: ['Sprint'],
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
      providesTags: ['Sprint', 'Issue'],
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
  useGetSprintByIdQuery,
  useLazyGetSprintByIdQuery,
  useGetSprintForBoardQuery,
  useAddSprintMutation,
  useUpdateSprintMutation,
  useDeleteSprintMutation,
} = sprintsEndpoints
