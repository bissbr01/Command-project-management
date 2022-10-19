import { useAuth0 } from '@auth0/auth0-react'

export default function Auth0ShowUser() {
  const { user, isAuthenticated, isLoading } = useAuth0()

  if (isLoading) {
    return <div>Loading ...</div>
  }

  return (
    <div>
      {isAuthenticated && (
        <div>
          showing info
          <img src={user?.picture} alt={user?.name} />
          <h2>{user?.name}</h2>
          <p>{user?.email}</p>
        </div>
      )}
    </div>
  )
}
