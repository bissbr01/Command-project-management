import _ from 'lodash'
import { BoardColumns, BoardColumnsData } from './issuesEndpoints'
import { scrumApi } from './scrumApi'
import { IssueStatus, Sprint } from './types'

const sprintsEndpoints = scrumApi.injectEndpoints({
  endpoints: (build) => ({
    getSprints: build.query<Sprint[], void>({
      query: () => '/sprints',
      providesTags: ['Sprint'],
    }),
    getSprintById: build.query<Sprint, string>({
      query: (id) => `/sprints/${id}`,
      providesTags: ['Sprint'],
    }),
    GetSprintByActive: build.query<BoardColumnsData, void>({
      query: () => 'sprints/active',
      transformResponse: (response: Sprint) => {
        const sorted = _.orderBy(response.issues, ['boardOrder'], ['asc'])
        const issues = _.groupBy(sorted, 'status')
        const boardColumns = {
          sprint: response,
          boardColumns: {
            [IssueStatus.Backlog]: {
              status: IssueStatus.Backlog,
              name: 'Backlog',
              issues: issues?.backlog ?? [],
            },
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
        return boardColumns
      },
      providesTags: ['Sprint', 'Issue'],
    }),
    addSprint: build.mutation<Sprint, Omit<Sprint, 'id'>>({
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
  useGetSprintByActiveQuery,
  useAddSprintMutation,
  useUpdateSprintMutation,
  useDeleteSprintMutation,
} = sprintsEndpoints
