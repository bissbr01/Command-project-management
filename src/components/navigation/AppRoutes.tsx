import { useEffect } from 'react'
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import jwt_decode, { JwtPayload } from 'jwt-decode'
import App from '../../App'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { removeLogin, setToken } from '../../reducers/authentication'
import { RootState } from '../../store'
import BoardLayout from '../boards/BoardLayout'
import NotFound from '../common/NotFound'
import Login from '../login/Login'
import Register from '../login/Register'
import Board from '../boards/Board'
import Backlog from '../backlog/Backlog'

export default function AppRoutes() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const tokenSelector = (state: RootState) => state.auth.token
  const token = useAppSelector(tokenSelector)
  const location = useLocation()

  useEffect(() => {
    // check if login token saved in local storage, if so set to auth state
    if (!token) {
      const cachedTokenJSON = window.localStorage.getItem('token')
      if (cachedTokenJSON) {
        const cachedToken = JSON.parse(cachedTokenJSON)
        dispatch(setToken(cachedToken))
        navigate('/')
      }
    } else {
      // check if token is expired, and if so logout
      const decoded = jwt_decode<JwtPayload>(token)
      if (decoded.exp && decoded.exp < Date.now() / 1000) {
        dispatch(removeLogin())
      }
    }
  }, [dispatch, navigate, token])

  // The `backgroundLocation` state is the location that we were at when one of
  // the Issue links was clicked. If it's there, use it as the location for
  // the <Routes> so we show the boards in the background, behind the modal.
  const state = location.state as { backgroundLocation?: Location }

  return (
    <>
      <Routes location={state?.backgroundLocation || location}>
        <Route path="/" element={token ? <App /> : <Navigate to="/login" />}>
          <Route index element={<BoardLayout />} />
          <Route path="issues/:id" element={<BoardLayout />} />
          <Route path="sprint/:sprintId" element={<BoardLayout />} />
          <Route path="backlog" element={<Backlog />}>
            <Route path="sprint/:sprintId" element={<Backlog />} />
            <Route path=":id" element={<Backlog />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>

      {/* {state?.backgroundLocation && (
        <Routes>
          <Route path="/img/:id" element={<IssueSingle />} />
        </Routes>
      )} */}
    </>
  )
}
