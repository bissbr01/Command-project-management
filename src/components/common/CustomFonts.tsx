import { Global } from '@mantine/core'

export function CustomFonts() {
  return (
    <Global
      styles={[
        {
          '@font-face': {
            fontFamily: 'Mitr',
            src: `url('https://fonts.googleapis.com/css2?family=Mitr&display=swap') format("woff2")`,
            fontWeight: 400,
            fontStyle: 'normal',
          },
        },
        {
          '@font-face': {
            fontFamily: 'Mitr',
            src: `url('https://fonts.googleapis.com/css2?family=Nunito:wght@700&display=swap') format("woff2")`,
            fontWeight: 700,
            fontStyle: 'normal',
          },
        },
      ]}
    />
  )
}
