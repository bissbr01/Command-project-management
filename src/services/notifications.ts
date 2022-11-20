import { scrumApi } from './scrumApi'
import { Notification } from './types'

const notificationsEndpoints = scrumApi.injectEndpoints({
  endpoints: (build) => ({
    getNotifications: build.query<Notification[], void>({
      query: () => '/notifications',
      providesTags: ['Notification', { type: 'Notification', id: 'LIST' }],
    }),
    getNotificationById: build.query<Notification, string>({
      query: (id) => `/notifications/${id}`,
      providesTags: (result, error, id) => [{ type: 'Notification', id }],
    }),
    updateNotification: build.mutation<Notification, Partial<Notification>>({
      query: ({ id, ...body }) => ({
        url: `/notifications/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Notification', id },
        'Notification',
      ],
    }),
    addNotification: build.mutation<
      Notification,
      Pick<Notification, 'type' | 'message' | 'userId' | 'colleagueId'>
    >({
      query: (body) => ({
        url: '/notifications',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
  overrideExisting: false,
})

// eslint-disable-next-line import/prefer-default-export
export const {
  useGetNotificationsQuery,
  useGetNotificationByIdQuery,
  useAddNotificationMutation,
  useUpdateNotificationMutation,
} = notificationsEndpoints
