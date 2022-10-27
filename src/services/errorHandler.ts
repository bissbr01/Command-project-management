import { isRejectedWithValue } from '@reduxjs/toolkit'
import type { MiddlewareAPI, Middleware } from '@reduxjs/toolkit'
import { showNotification } from '@mantine/notifications'
import { IconX } from '@tabler/icons'

/**
 * Log a warning and show a toast!
 */
export const rtkQueryErrorLogger: Middleware =
  (api: MiddlewareAPI) => (next) => (action) => {
    // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
    if (isRejectedWithValue(action)) {
      const m = action.payload.data.error.errors[0].message
      showNotification({
        title: 'Error',
        message: m,
        autoClose: 4000,
        color: 'red',
      })
    }

    return next(action)
  }
