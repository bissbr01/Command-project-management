import { useEffect, useState } from 'react'
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import { Loader } from '@mantine/core'
import { useAuth0 } from '@auth0/auth0-react'
import App from '../../App'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { RootState } from '../../store'
import BoardLayout from '../boards/BoardLayout'
import NotFound from '../common/NotFound'
import Login from '../login/Login'
import Register from '../login/Register'
import Backlog from '../backlog/Backlog'
import ProjectList from '../projects/ProjectList'
import CheckAuth from './CheckAuth'
import PeopleLayout from '../people/PeopleLayout'

export default function AppRoutes() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const tokenSelector = (state: RootState) => state.auth.token
  const token = useAppSelector(tokenSelector)
  const location = useLocation()
  const [isUser, setIsUser] = useState(false)
  const { isLoading, isAuthenticated } = useAuth0()

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
          element={
            token && isAuthenticated && isUser ? (
              <App />
            ) : (
              <CheckAuth setIsUser={setIsUser} />
            )
          }
        >
          <Route index element={<ProjectList />} />
          <Route path="people" element={<PeopleLayout />} />
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
