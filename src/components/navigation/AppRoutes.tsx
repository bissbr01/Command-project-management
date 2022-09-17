import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import App from '../../App'
import { setAuth } from '../../reducers/authentication'
import { RootState } from '../../store'
import BoardLayout from '../boards/BoardLayout'
import NotFound from '../common/NotFound'
import Login from '../login/Login'

export default function AppRoutes() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const tokenSelector = (state: RootState) => state.auth.token
  const token = useSelector(tokenSelector)

  // check if login token saved in local storage
  useEffect(() => {
    if (!token) {
      console.log('no token, setting')
      const cachedUserJSON = window.localStorage.getItem('user')
      if (cachedUserJSON) {
        const cachedUser = JSON.parse(cachedUserJSON)
        dispatch(setAuth(cachedUser))
        navigate('/')
      }
    }
  }, [dispatch, navigate, token])

  console.log('in routes app: ', token)
  return (
    <Routes>
      <Route path="/" element={token ? <App /> : <Navigate to="/login" />}>
        <Route index element={<BoardLayout />} />
        <Route path="boards" element={<BoardLayout />} />
      </Route>
      <Route path="*" element={<NotFound />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}
