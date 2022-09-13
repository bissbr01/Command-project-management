import { scrumApi } from './scrumApi'
import { Sprint } from './types'

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
    addSprint: build.mutation<Sprint, Omit<Sprint, 'id'>>({
      query: (body) => ({
        url: '/sprints',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Sprint'],
    }),
    updateSprint: build.mutation<Sprint, Partial<Sprint>>({
      query: ({ id, ...body }) => ({
        url: `/sprints/${id}`,
        method: 'PUT',
        body,
      }),
    }),
  }),
  overrideExisting: true,
})

// eslint-disable-next-line import/prefer-default-export
export const {
  useGetSprintsQuery,
  useGetSprintByIdQuery,
  useAddSprintMutation,
  useUpdateSprintMutation,
} = sprintsEndpoints
