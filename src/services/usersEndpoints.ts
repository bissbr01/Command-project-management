import { scrumApi } from './scrumApi'
import { Token, User } from './types'

const usersEndpoints = scrumApi.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<User[], void>({
      query: () => '/users',
      providesTags: ['User'],
    }),
    getUserByToken: build.query<User, void>({
      query: () => '/users/me',
      providesTags: [
        'User',
        { type: 'User', id: 'COLLEAGUES' },
        { type: 'Team', id: 'LIST' },
      ],
    }),
    addUser: build.mutation<{ user: User; created: boolean }, Token>({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    addColleague: build.mutation<{ result: User }, { email: string }>({
      query: (body) => ({
        url: '/users/me/colleagues',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'User', id: 'COLLEAGUES' }],
    }),
    updateUser: build.mutation<User, Partial<User>>({
      query: ({ id, ...body }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['User'],
    }),
  }),
  overrideExisting: false,
})

export default usersEndpoints
export const {
  useGetUsersQuery,
  useGetUserByTokenQuery,
  useAddUserMutation,
  useAddColleagueMutation,
  useUpdateUserMutation,
} = usersEndpoints
