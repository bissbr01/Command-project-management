import { useAuth0 } from '@auth0/auth0-react'
import { Loader } from '@mantine/core'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { setLogin } from '../../reducers/authentication'
import { useAddUserMutation } from '../../services/usersEndpoints'
import { RootState } from '../../store'
import LoadingCircle from '../common/LoadingCircle'

interface CheckAuthProps {
  setIsUser: React.Dispatch<React.SetStateAction<boolean>>
}

export default function CheckAuth({ setIsUser }: CheckAuthProps) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const tokenSelector = (state: RootState) => state.auth.token
  const token = useAppSelector(tokenSelector)
  const [findOrAddUser] = useAddUserMutation()

  const {
    loginWithRedirect,
    isAuthenticated,
    isLoading,
    error,
    getAccessTokenSilently,
    getIdTokenClaims,
  } = useAuth0()

  useEffect(() => {
    // check if access token available in Redux store. if not, set token
    try {
      if (isLoading) return

      const getToken = async () => {
        if (!isAuthenticated) {
          await loginWithRedirect({
            authorizationParams: {
              redirect_uri: window.location.origin,
            },
          })
        }
        if (!token) {
          const accessToken = await getAccessTokenSilently()
          const idToken = await getIdTokenClaims()
          // set access token as bearer in api requests:
          dispatch(
            setLogin({
              access_token: accessToken,
            })
          )
          if (idToken) {
            await findOrAddUser({ idToken }).unwrap()
            setIsUser(true)
            navigate('/projects')
          }
        }
        getToken()
      }
    } catch (e) {
      console.log(e)
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
    findOrAddUser,
    setIsUser,
  ])
  if (isLoading) return <LoadingCircle />
  if (error) return <div>{error.message}</div>
  return <LoadingCircle />
}
