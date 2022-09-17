import { scrumApi } from './scrumApi'
import { Auth, Credentials } from './types'

const loginEndpoints = scrumApi.injectEndpoints({
  endpoints: (build) => ({
    authenticate: build.mutation<Auth, Credentials>({
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
export const { useAuthenticateMutation } = loginEndpoints
