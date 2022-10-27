import { useAuth0 } from '@auth0/auth0-react'
import { Loader } from '@mantine/core'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { setLogin } from '../../reducers/authentication'
import { useAddUserMutation } from '../../services/usersEndpoints'
import { RootState } from '../../store'

interface CheckAuthProps {
  setIsUser: React.Dispatch<React.SetStateAction<boolean>>
}

export default function CheckAuth({ setIsUser }: CheckAuthProps) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const tokenSelector = (state: RootState) => state.auth.token
  const token = useAppSelector(tokenSelector)
  const [addUser, { isLoading: userLoading }] = useAddUserMutation()

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
      if (!isLoading) {
        const getToken = async () => {
          if (!isAuthenticated) {
            await loginWithRedirect()
          }

          if (!token) {
            const accessToken = await getAccessTokenSilently()
            const idToken = await getIdTokenClaims()
            // set access token as bearer in backend api requests:
            if (idToken) {
              dispatch(
                setLogin({
                  // eslint-disable-next-line no-underscore-dangle
                  id_token: idToken.__raw,
                  access_token: accessToken,
                })
              )
              // find or create user from auth0 in local database
              // eslint-disable-next-line no-underscore-dangle
              await addUser({ token: idToken.__raw }).unwrap()
              setIsUser(true)
              navigate('/projects')
            }
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
    addUser,
    setIsUser,
  ])
  if (isLoading || userLoading) return <Loader />
  if (error) return <div>{error.message}</div>
  return <Loader />
}
