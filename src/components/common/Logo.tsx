import {
  createStyles,
  Group,
  Image,
  Text,
  ThemeIcon,
  Title,
  useMantineTheme,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { IconBus } from '@tabler/icons'
import { Link, useNavigate } from 'react-router-dom'
import commandLogoOnly from '../../logo-only.png'

const useStyles = createStyles((theme) => ({
  logoLink: {
    textDecoration: 'none',
  },
}))

function Logo() {
  const theme = useMantineTheme()
  const { classes } = useStyles()
  const minMediumScreen = useMediaQuery(
    `(min-width: ${theme.breakpoints.sm}px)`
  )

  return (
    <Link to="/" className={classes.logoLink}>
      <Group>
        <span style={{ width: 50, height: 'auto' }}>
          <Image src={commandLogoOnly} />
        </span>
        <Title order={1} size="h2" color={theme.colors.brand[7]}>
          Command
        </Title>
        {minMediumScreen && (
          <Text color="dimmed" size="sm">
            Project Management
          </Text>
        )}
      </Group>
    </Link>
  )
}

export default Logo
