import { isRejectedWithValue } from '@reduxjs/toolkit'
import type { MiddlewareAPI, Middleware } from '@reduxjs/toolkit'
import { showNotification } from '@mantine/notifications'

/**
 * Log a warning and show a toast!
 */
export const rtkQueryErrorLogger: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
    if (isRejectedWithValue(action)) {
      const { message } = action.payload.data.errors[0]
      showNotification({
        title: 'Error',
        message,
        autoClose: 4000,
        color: 'red',
      })
    }

    return next(action)
  }
