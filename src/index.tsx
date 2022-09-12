import { MantineProvider } from '@mantine/core'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Auth0Provider } from '@auth0/auth0-react'
import { store } from './store'
import App from './App'
import reportWebVitals from './reportWebVitals'
import BoardLayout from './components/boards/BoardLayout'

const container = document.getElementById('root')
if (container) {
  const root = createRoot(container)
  root.render(
    // <React.StrictMode>
    <Provider store={store}>
      <Auth0Provider
        domain="dev-w8p6njku.us.auth0.com"
        clientId="n0IFYEEMmgxhyAmitLokeYGVyHKcrRSZ"
        redirectUri={window.location.origin}
        audience="https://scrum-management-backend.onrender.com"
        scope="admin user"
      >
        <Router>
          <MantineProvider
            withNormalizeCSS
            withGlobalStyles
            theme={{
              // headings: { fontFamily: 'Greycliff CF, sans-serif' },
              // fontFamily: 'Open Sans, sans serif',
              colorScheme: 'light',
              colors: {
                brand: [
                  '#ECF8F2',
                  '#CAECDA',
                  '#A8E0C3',
                  '#86D4AB',
                  '#64C894',
                  '#43BC7C',
                  '#359763',
                  '#28714B',
                  '#1B4B32',
                  '#0D2619',
                ],
              },
              primaryColor: 'brand',
              primaryShade: { light: 4, dark: 6 },
            }}
          >
            <Routes>
              <Route path="/" element={<App />}>
                <Route index element={<BoardLayout />} />
              </Route>
            </Routes>
          </MantineProvider>
        </Router>
      </Auth0Provider>
    </Provider>
    // </React.StrictMode>
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
