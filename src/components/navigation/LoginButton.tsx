import { useAuth0 } from '@auth0/auth0-react'

function LoginButton() {
  const { loginWithRedirect } = useAuth0()

  return (
    <button type="button" onClick={() => loginWithRedirect()}>
      Log In
    </button>
  )
}

export default LoginButton
