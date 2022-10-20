import { useAuth0 } from '@auth0/auth0-react'
import { Loader } from '@mantine/core'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { setLogin, setToken } from '../../reducers/authentication'
import { RootState } from '../../store'

export default function CheckAuth() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const tokenSelector = (state: RootState) => state.auth.token
  const token = useAppSelector(tokenSelector)
  const location = useLocation()
  const {
    loginWithRedirect,
    isAuthenticated,
    isLoading,
    error,
    logout,
    getAccessTokenSilently,
    getIdTokenClaims,
  } = useAuth0()

  useEffect(() => {
    // check if access token available in Redux store. if not, set token
    if (!isLoading) {
      const getToken = async () => {
        if (!isAuthenticated) {
          await loginWithRedirect()
        }

        if (!token) {
          const accessToken = await getAccessTokenSilently()
          const idToken = await getIdTokenClaims()
          dispatch(
            // eslint-disable-next-line no-underscore-dangle
            setLogin({ access_token: accessToken, id_token: idToken?.__raw })
          )
        }

        navigate('/')
      }
      getToken()

      // old login when authorization handled by bakend instead of auth0
      // const cachedTokenJSON = window.localStorage.getItem('token')
      // if (cachedTokenJSON) {
      //   const cachedToken = JSON.parse(cachedTokenJSON)
      //   dispatch(setToken(cachedToken))
      //   navigate('/')
      // }
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
    isLoading,
    loginWithRedirect,
  ])
  if (isLoading) return <Loader />
  if (error) return <div>{error.message}</div>
  return <Loader />
}
