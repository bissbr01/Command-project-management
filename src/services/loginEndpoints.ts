import { scrumApi } from './scrumApi'
import { Auth, Credentials } from './types'

const loginEndpoints = scrumApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<Auth, Credentials>({
      query: (body) => ({
        url: '/login',
        method: 'POST',
        body,
      }),
    }),
  }),
  overrideExisting: true,
})

export default loginEndpoints
export const { useLoginMutation } = loginEndpoints
