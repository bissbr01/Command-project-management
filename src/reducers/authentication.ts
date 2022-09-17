/* eslint-disable no-param-reassign */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import loginEndpoints from '../services/loginEndpoints'
import { Auth, User } from '../services/types'
// eslint-disable-next-line import/no-cycle
import { AppThunk } from '../store'

interface AuthState {
  user: Pick<User, 'email' | 'fullName' | 'admin'>
  token: string
}

const initialState = {
  user: { email: '', fullName: '', admin: false },
  token: '',
} as AuthState

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, { payload }: PayloadAction<Auth>) {
      state.token = payload.token
      state.user = payload.user
    },
    removeAuth() {
      return initialState
    },
  },
})

// Extract and export each action creator by name
export const { setAuth, removeAuth } = authSlice.actions
// Export the reducer, either as a default or named export
export default authSlice.reducer

export const setLogin =
  (auth: Auth): AppThunk =>
  (dispatch) => {
    console.log('setLogin thunk')
    window.localStorage.setItem('auth', JSON.stringify(auth))
    dispatch(setAuth(auth))
  }

export const removeLogin = (): AppThunk => (dispatch) => {
  console.log('removeLogin thunk')
  window.localStorage.removeItem('auth')
  dispatch(removeAuth())
}
