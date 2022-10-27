import { MantineProvider } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react'
import { Provider } from 'react-redux'
import { store } from './store'
import { CustomFonts } from './components/common/GlobalStyles'
import reportWebVitals from './reportWebVitals'
import AppRoutes from './components/navigation/AppRoutes'

const container = document.getElementById('root')
if (container) {
  const root = createRoot(container)
  root.render(
    <NotificationsProvider position="bottom-left">
      <Auth0Provider
        domain="dev-w8p6njku.us.auth0.com"
        clientId="n0IFYEEMmgxhyAmitLokeYGVyHKcrRSZ"
        redirectUri={window.location.origin}
        audience="https://scrum-management-backend.onrender.com"
        scope="read:current_user update:current_user_metadata"
      >
        <Provider store={store}>
          <Router>
            <MantineProvider
              withNormalizeCSS
              withGlobalStyles
              theme={{
                // headings: { fontFamily: 'Greycliff CF, sans-serif' },
                // fontFamily: 'Open Sans, sans serif',
                colorScheme: 'light',
                fontFamily: 'Mitr, sans-serif',
                headings: {
                  fontFamily: 'Mitr, sans-serif',
                  fontWeight: 300,
                },
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
                other: {
                  cardWidth: '200px',
                  cardHeight: '200px',
                },
              }}
            >
              <CustomFonts />
              <AppRoutes />
            </MantineProvider>
          </Router>
        </Provider>
      </Auth0Provider>
    </NotificationsProvider>
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
