import { scrumApi } from './scrumApi'
import { ErrorRes, Team } from './types'

const teamsEndpoints = scrumApi.injectEndpoints({
  endpoints: (build) => ({
    getTeams: build.query<Team[], void>({
      query: () => '/teams',
      providesTags: ['Team'],
    }),
    getTeamById: build.query<Team, number>({
      query: (id) => `/teams/${id}`,
      providesTags: (res, e, id) => [{ type: 'Team', id }],
    }),
    addTeam: build.mutation<
      Team | ErrorRes,
      { name: string; userIds: string[] }
    >({
      query: (body) => ({
        url: '/teams',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Team', { type: 'Team', id: 'LIST' }],
    }),
    updateTeam: build.mutation<
      Team | ErrorRes,
      { id: number; name: string; userIds: string[] }
    >({
      query: ({ id, ...body }) => ({
        url: `/teams/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        'Team',
        { type: 'Team', id: arg.id },
      ],
    }),
    deleteTeam: build.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/teams/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Team', id: arg },
        { type: 'Team', id: 'LIST' },
        'Team',
      ],
    }),
  }),
  overrideExisting: false,
})

export default teamsEndpoints
export const {
  useGetTeamsQuery,
  useGetTeamByIdQuery,
  useAddTeamMutation,
  useUpdateTeamMutation,
  useDeleteTeamMutation,
} = teamsEndpoints
