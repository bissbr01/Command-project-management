import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { createStyles, Group } from '@mantine/core'
import { Outlet } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import SideNavContainer from './components/navigation/SideNavContainer'
import TopNav from './components/navigation/TopNav'
import { setToken } from './reducers/authentication'

const useStyles = createStyles(() => ({
  group: {
    alignItems: 'flex-start',
  },
}))

function App() {
  const { classes } = useStyles()
  const dispatch = useDispatch()
  const { getAccessTokenSilently } = useAuth0()

  useEffect(() => {
    const setAccessToken = async () => {
      try {
        const accessToken = await getAccessTokenSilently({
          audience: `https://scrum-management-backend.onrender.com`,
          scope: 'user',
        })

        dispatch(setToken({ token: accessToken }))
      } catch (e: unknown) {
        if (e instanceof Error) console.log(e.message)
      }
    }

    setAccessToken()
  }, [getAccessTokenSilently, dispatch])

  const topNavLinks = [
    { link: 'projects', label: 'Projects' },
    { link: 'people', label: 'People' },
  ]

  return (
    <div>
      <TopNav links={topNavLinks} />
      <Group className={classes.group}>
        <SideNavContainer />
        <Outlet />
      </Group>
    </div>
  )
}

export default App
