import { Group } from '@mantine/core'
import { Outlet } from 'react-router-dom'
import SideNavContainer from './features/navigation/SideNavContainer'
import TopNav from './features/navigation/TopNav'

function App() {
  const topNavLinks = [
    { link: 'projects', label: 'Projects' },
    { link: 'people', label: 'People' },
  ]

  return (
    <div>
      <TopNav links={topNavLinks} />
      <Group>
        <SideNavContainer />
        <Outlet />
      </Group>
    </div>
  )
}

export default App
