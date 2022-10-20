import { useEffect } from 'react'
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import { Loader } from '@mantine/core'
import jwt_decode, { JwtPayload } from 'jwt-decode'
import { useAuth0 } from '@auth0/auth0-react'
import App from '../../App'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { removeLogin, setToken } from '../../reducers/authentication'
import { RootState } from '../../store'
import BoardLayout from '../boards/BoardLayout'
import NotFound from '../common/NotFound'
import Login from '../login/Login'
import Register from '../login/Register'
import Backlog from '../backlog/Backlog'
import ProjectList from '../projects/ProjectList'
import TeamList from '../teams/TeamList'

export default function AppRoutes() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const tokenSelector = (state: RootState) => state.auth.token
  const token = useAppSelector(tokenSelector)
  const location = useLocation()
  const {
    loginWithRedirect,
    isAuthenticated,
    isLoading,
    logout,
    getAccessTokenSilently,
    getIdTokenClaims,
  } = useAuth0()

  useEffect(() => {
    // check if login token available by auth0, if so set to auth state
    if (!token && isAuthenticated) {
      const getToken = async () => {
        const accessToken = await getAccessTokenSilently()
        dispatch(setToken({ token: accessToken }))
        navigate('/')
        // const claims = await getIdTokenClaims()
        // // eslint-disable-next-line no-underscore-dangle
        // const idToken = claims?.__raw
        // console.log(idToken)
      }
      getToken()

      // old login when authorization handled by bakend instead of auth0
      // const cachedTokenJSON = window.localStorage.getItem('token')
      // if (cachedTokenJSON) {
      //   const cachedToken = JSON.parse(cachedTokenJSON)
      //   dispatch(setToken(cachedToken))
      //   navigate('/')
      // }
    } else {
      // check if token is expired, and if so logout
      // const decoded = jwt_decode<JwtPayload>(token)
      // if (decoded.exp && decoded.exp < Date.now() / 1000) {
      //   dispatch(removeLogin())
      // }
    }
  }, [
    dispatch,
    getAccessTokenSilently,
    getIdTokenClaims,
    isAuthenticated,
    navigate,
    token,
  ])

  // The `backgroundLocation` state is the location that we were at when one of
  // the Issue links was clicked. If it's there, use it as the location for
  // the <Routes> so we show the boards in the background, behind the modal.
  const state = location.state as { backgroundLocation?: Location }
  if (isLoading) return <Loader />

  return (
    <>
      <Routes location={state?.backgroundLocation || location}>
        <Route
          path="/"
          element={isAuthenticated ? <App /> : <Navigate to="/login" />}
        >
          <Route index element={<ProjectList />} />
          <Route path="teams" element={<TeamList />} />
          <Route path="projects" element={<ProjectList />} />
          <Route path="projects/:projectId">
            <Route path="board" element={<BoardLayout />}>
              <Route path="issues/:id" element={<BoardLayout />} />
              <Route path="sprint/:sprintId" element={<BoardLayout />} />
            </Route>
            <Route path="backlog" element={<Backlog />}>
              <Route path="issues/:id" element={<BoardLayout />} />
              <Route path="sprint/:sprintId" element={<Backlog />} />
            </Route>
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
