import { scrumApi } from './scrumApi'
import { Comment } from './types'

const commentsEndpoints = scrumApi.injectEndpoints({
  endpoints: (build) => ({
    getComments: build.query<Comment[], void>({
      query: () => '/comments',
      providesTags: ['Comment'],
    }),
    getCommentsByIssue: build.query<Comment[], number>({
      query: (issueId) => `/comments/issue/${issueId}`,
      providesTags: ['Comment'],
    }),
    getCommentById: build.query<Comment, string>({
      query: (id) => `/comments/${id}`,
      providesTags: (result, error, arg) => [{ type: 'Comment', id: arg }],
    }),
    addComment: build.mutation<Comment, Pick<Comment, 'issueId' | 'text'>>({
      query: (body) => ({
        url: '/comments',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Comment', { type: 'Issue', id: 'LIST' }],
    }),
    updateComment: build.mutation<Comment, Partial<Comment>>({
      query: ({ id, ...body }) => ({
        url: `/comments/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Comment', id: arg.id },
      ],
    }),
    deleteComment: build.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/comments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Comment', id: arg },
        'Comment',
      ],
    }),
  }),
  overrideExisting: true,
})

// eslint-disable-next-line import/prefer-default-export
export const {
  useGetCommentsQuery,
  useGetCommentsByIssueQuery,
  useGetCommentByIdQuery,
  useAddCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentsEndpoints
