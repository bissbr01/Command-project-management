import { useSelector } from 'react-redux'
import { Navigate, Route, Routes } from 'react-router-dom'
import App from '../../App'
import { RootState } from '../../store'
import BoardLayout from '../boards/BoardLayout'
import NotFound from '../common/NotFound'
import Login from '../login/Login'

export default function AppRoutes() {
  const authSelector = (state: RootState) => state.auth
  const { token } = useSelector(authSelector)
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
