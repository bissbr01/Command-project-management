/* eslint-disable no-param-reassign */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import loginEndpoints from '../services/loginEndpoints'
import { scrumApi } from '../services/scrumApi'
import { Auth, User } from '../services/types'

interface AuthState {
  user: Pick<User, 'email' | 'fullName' | 'admin'>
  token: string
}

const initialState = {
  user: { email: '', fullName: '' },
  token: '',
} as AuthState

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, { payload }: PayloadAction<Auth>) {
      window.localStorage.setItem('user', JSON.stringify(payload))
      state.token = payload.token
      state.user = payload.user
    },
    checkAuth(state) {
      const cachedUserJSON = window.localStorage.getItem('user')
      console.log('JSON: ', cachedUserJSON)
      if (cachedUserJSON) {
        const cachedUser = JSON.parse(cachedUserJSON)
        console.log(cachedUser)
        return cachedUser
      }
      return state
    },
    removeAuth() {
      window.localStorage.removeItem('user')
      return initialState
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      loginEndpoints.endpoints.authenticate.matchFulfilled,
      (state, { payload }: PayloadAction<Auth>) => {
        window.localStorage.setItem('user', JSON.stringify(payload))
        state.token = payload.token
        state.user = payload.user
      }
    )
  },
})

// Extract and export each action creator by name
export const { setAuth, checkAuth, removeAuth } = authSlice.actions
// Export the reducer, either as a default or named export
export default authSlice.reducer
