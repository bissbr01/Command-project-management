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
      providesTags: ['User'],
    }),
    addUser: build.mutation<User, Token>({
      query: ({ token }) => ({
        url: '/users',
        method: 'POST',
        token,
      }),
      invalidatesTags: ['User'],
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
  useUpdateUserMutation,
} = usersEndpoints
