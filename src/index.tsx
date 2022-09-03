import React from 'react'
import { MantineProvider } from '@mantine/core'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './app/store'
import App from './App'
import reportWebVitals from './reportWebVitals'

const container = document.getElementById('root')
if (container) {
  const root = createRoot(container)
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
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
            primaryShade: { light: 5, dark: 7 },
          }}
        >
          <App />
        </MantineProvider>
      </Provider>
    </React.StrictMode>
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
