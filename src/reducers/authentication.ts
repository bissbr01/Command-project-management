/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  token: string
  type: string
}

const initialState = { token: '', type: 'Bearer' } as AuthState

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, { payload: { token } }: PayloadAction<{ token: string }>) {
      state.token = token
    },
    deleteAuth() {
      return initialState
    },
  },
})

// Extract and export each action creator by name
export const { setToken, deleteAuth } = authSlice.actions
// Export the reducer, either as a default or named export
export default authSlice.reducer
