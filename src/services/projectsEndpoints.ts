import { scrumApi } from './scrumApi'
import { Project } from './types'

const projectsEndpoints = scrumApi.injectEndpoints({
  endpoints: (build) => ({
    getProjects: build.query<Project[], void>({
      query: () => '/projects',
      providesTags: ['Project'],
    }),
    getProjectById: build.query<Project, string>({
      query: (id) => `/projects/${id}`,
      providesTags: ['Project'],
    }),
    addProject: build.mutation<Project, Omit<Project, 'id'>>({
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
        method: 'PUT',
        body,
      }),
    }),
  }),
  overrideExisting: true,
})

// eslint-disable-next-line import/prefer-default-export
export const {
  useGetProjectsQuery,
  useGetProjectByIdQuery,
  useAddProjectMutation,
  useUpdateProjectMutation,
} = projectsEndpoints
