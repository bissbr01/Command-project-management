/* eslint-disable no-param-reassign */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Token } from '../services/types'
// eslint-disable-next-line import/no-cycle
import { AppThunk } from '../store'

const initialState = {
  token: '',
} as Token

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken(state, { payload }: PayloadAction<Token>) {
      state.token = payload.token
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

export const setLogin =
  (token: Token): AppThunk =>
  (dispatch) => {
    console.log('setLogin thunk')
    window.localStorage.setItem('token', JSON.stringify(token))
    dispatch(setToken(token))
  }

export const removeLogin = (): AppThunk => (dispatch) => {
  console.log('removeLogin thunk')
  window.localStorage.removeItem('token')
  dispatch(removeToken())
}
