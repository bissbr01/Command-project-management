import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Route, Routes } from 'react-router-dom'
import App from '../../App'
import { checkStorageForToken, setToken } from '../../reducers/authentication'
import { RootState } from '../../store'
import BoardLayout from '../boards/BoardLayout'
import NotFound from '../common/NotFound'
import Login from '../login/Login'

export default function AppRoutes() {
  const dispatch = useDispatch()
  const authSelector = (state: RootState) => state.auth
  const { token } = useSelector(authSelector)

  useEffect(() => {
    const cachedUserJSON = window.localStorage.getItem('user')
    console.log('JSON: ', cachedUserJSON)
    if (cachedUserJSON) {
      const cachedUser = JSON.parse(cachedUserJSON)
      console.log(cachedUser)
      dispatch(setToken(cachedUser))
    }
  }, [dispatch])

  return (
    <Routes>
      <Route
        path="/"
        element={
          token || window.localStorage.getItem('user') ? (
            <App />
          ) : (
            <Navigate to="/login" />
          )
        }
      >
        <Route index element={<BoardLayout />} />
        <Route path="boards" element={<BoardLayout />} />
      </Route>
      <Route path="*" element={<NotFound />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}
