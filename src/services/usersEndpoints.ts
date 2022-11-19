import { scrumApi } from './scrumApi'
import { Notification, NotificationType, Token, User } from './types'

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
    updateUser: build.mutation<User, Partial<User>>({
      query: ({ id, ...body }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    addNotification: build.mutation<
      { result: Notification },
      { email: string; type: NotificationType }
    >({
      query: (body) => ({
        url: '/users/me/notifications',
        method: 'POST',
        body,
      }),
    }),
    addColleague: build.mutation<{ result: User }, { email: string }>({
      query: (body) => ({
        url: '/users/me/colleagues',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'User', id: 'COLLEAGUES' }],
    }),
    removeColleague: build.mutation<{ result: User }, Pick<User, 'id'>>({
      query: ({ id }) => ({
        url: `/users/me/colleagues/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'User', id: 'COLLEAGUES' }],
    }),
  }),
  overrideExisting: false,
})

export default usersEndpoints
export const {
  useGetUsersQuery,
  useGetUserByTokenQuery,
  useAddUserMutation,
  useAddNotificationMutation,
  useAddColleagueMutation,
  useUpdateUserMutation,
  useRemoveColleagueMutation,
} = usersEndpoints
