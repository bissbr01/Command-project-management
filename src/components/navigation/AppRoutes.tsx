import { useEffect } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import App from '../../App'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { setToken } from '../../reducers/authentication'
import { RootState } from '../../store'
import BoardLayout from '../boards/BoardLayout'
import NotFound from '../common/NotFound'
import IssueSingle from '../issues/Issue'
import Login from '../login/Login'
import Register from '../login/Register'

export default function AppRoutes() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const tokenSelector = (state: RootState) => state.auth.token
  const token = useAppSelector(tokenSelector)

  // check if login token saved in local storage
  useEffect(() => {
    if (!token) {
      const cachedUserJSON = window.localStorage.getItem('token')
      if (cachedUserJSON) {
        const cachedUser = JSON.parse(cachedUserJSON)
        dispatch(setToken(cachedUser))
        navigate('/')
      }
    }
  }, [dispatch, navigate, token])

  return (
    <Routes>
      <Route path="/" element={token ? <App /> : <Navigate to="/login" />}>
        <Route index element={<BoardLayout />} />
        <Route path="boards" element={<BoardLayout />} />
        {/* <Route path="issues/:id" elemefnt={<IssueSingle />} /> */}
      </Route>
      <Route path="*" element={<NotFound />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}
