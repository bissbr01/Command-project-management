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
      <SideNavContainer />
    </div>
  )
}

export default App
