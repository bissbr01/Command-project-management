import { scrumApi } from './scrumApi'
import { LoginResponse, User } from './types'

const loginEndpoints = scrumApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<LoginResponse, Pick<User, 'email' | 'password'>>({
      query: (body) => ({
        url: '/login',
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: true,
})

// eslint-disable-next-line import/prefer-default-export
export const { useLoginMutation } = loginEndpoints
