import { createStyles, Group } from '@mantine/core'
import { Outlet } from 'react-router-dom'
import SideNavContainer from './components/navigation/SideNavContainer'
import TopNav from './components/navigation/TopNav'

const useStyles = createStyles(() => ({
  group: {
    alignItems: 'flex-start',
  },
}))

function App() {
  const { classes } = useStyles()

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
