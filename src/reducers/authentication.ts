/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LoginResponse } from '../services/types'

interface AuthState {
  token: string
  name: string
  email: string
}

const initialState = { token: '', name: '', email: '' } as AuthState

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, { payload }: PayloadAction<LoginResponse>) {
      return payload
    },
    removeToken() {
      return initialState
    },
  },
})

// Extract and export each action creator by name
export const { setToken, removeToken } = authSlice.actions
// Export the reducer, either as a default or named export
export default authSlice.reducer
