import { createStyles, Group } from '@mantine/core'
import { Outlet } from 'react-router-dom'
import SideNavContainer from './components/navigation/SideNavContainer'
import TopNav from './components/navigation/TopNav'
import { useGetUserByTokenQuery } from './services/usersEndpoints'

const useStyles = createStyles(() => ({
  group: {
    alignItems: 'flex-start',
  },
}))

function App() {
  const { classes } = useStyles()
  const { data, isLoading, error } = useGetUserByTokenQuery()

  const topNavLinks = [
    { link: 'projects', label: 'Projects' },
    { link: 'people', label: 'People' },
  ]

  if (isLoading) return <main>Loading </main>
  if (error) return <main>Error!</main>

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
