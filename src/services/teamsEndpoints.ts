import { scrumApi } from './scrumApi'
import { Team } from './types'

const teamsEndpoints = scrumApi.injectEndpoints({
  endpoints: (build) => ({
    getTeams: build.query<Team[], void>({
      query: () => '/teams',
      providesTags: ['Team'],
    }),
    getTeamById: build.query<Team[], number>({
      query: (id) => `/teams/${id}`,
      providesTags: (res, e, id) => [{ type: 'Team', id }],
    }),
    addTeam: build.mutation<Team, Omit<Team, 'id' | 'users'>>({
      query: (body) => ({
        url: '/teams',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Team'],
    }),
    updateTeam: build.mutation<Team, Partial<Team> & Pick<Team, 'id'>>({
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
    deleteProject: build.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/teams/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Team', id: arg },
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
} = teamsEndpoints
