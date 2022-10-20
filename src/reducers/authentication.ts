/* eslint-disable no-param-reassign */

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { scrumApi } from '../services/scrumApi'
import { Auth0TokenContainer, Token } from '../services/types'
import usersEndpoints from '../services/usersEndpoints'
// eslint-disable-next-line import/no-cycle
import { AppThunk } from '../store'

const initialState = {
  token: '',
}

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
  (token: Auth0TokenContainer): AppThunk =>
  (dispatch) => {
    console.log('setLogin thunk: ', token)
    window.localStorage.setItem('token', JSON.stringify(token.access_token))
    dispatch(setToken({ token: token.access_token }))
    if (token.id_token) {
      dispatch(
        usersEndpoints.endpoints.addUser.initiate({ token: token.id_token })
      )
    }
  }

export const removeLogin = (): AppThunk => (dispatch) => {
  console.log('removeLogin thunk')
  window.localStorage.removeItem('token')
  dispatch(removeToken())
}
