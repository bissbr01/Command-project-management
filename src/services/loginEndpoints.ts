import { scrumApi } from './scrumApi'
import { Credentials, Token } from './types'

const loginEndpoints = scrumApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<Token, Credentials>({
      query: (body) => ({
        url: '/login',
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: false,
})

export default loginEndpoints
export const { useLoginMutation } = loginEndpoints
