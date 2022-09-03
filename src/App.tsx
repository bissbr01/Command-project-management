import TopNav from './features/navigation/TopNav'

function App() {
  const topNavLinks = [
    { link: 'about', label: 'About' },
    { link: 'github', label: 'Github' },
  ]
  return (
    <div>
      <TopNav links={topNavLinks} />
    </div>
  )
}

export default App
