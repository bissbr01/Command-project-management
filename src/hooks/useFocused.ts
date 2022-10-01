import { useState } from 'react'

export function useFocused() {
  const [focused, setFocused] = useState(false)

  // formik requires timeouts to wrap setState to not conflict:
  // https://stackoverflow.com/questions/61031464/setstate-called-in-render-prop-is-causing-a-react-warning
  const handleFocused = (bool: boolean) => setTimeout(() => setFocused(bool), 0)

  return { focused, handleFocused }
}
