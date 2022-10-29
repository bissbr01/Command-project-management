import { scrumApi } from './scrumApi'
import { Project } from './types'

const projectsEndpoints = scrumApi.injectEndpoints({
  endpoints: (build) => ({
    getProjects: build.query<Project[], void>({
      query: () => '/projects',
      providesTags: ['Project', { type: 'Team', id: 'LIST' }],
    }),
    getProjectById: build.query<Project, string>({
      query: (id) => `/projects/${id}`,
      providesTags: (result, error, id) => [{ type: 'Sprint', id }],
    }),
    addProject: build.mutation<
      Project,
      Pick<Project, 'title' | 'teamId' | 'leadId'>
    >({
      query: (body) => ({
        url: '/projects',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Project'],
    }),
    updateProject: build.mutation<Project, Partial<Project>>({
      query: ({ id, ...body }) => ({
        url: `/projects/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Project', id },
        'Project',
      ],
    }),
    deleteProject: build.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/projects/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Project', id: arg },
        'Project',
      ],
    }),
  }),
  overrideExisting: false,
})

// eslint-disable-next-line import/prefer-default-export
export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useAddProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectsEndpoints
