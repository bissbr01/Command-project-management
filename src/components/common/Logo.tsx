import {
  Group,
  Image,
  Text,
  ThemeIcon,
  Title,
  useMantineTheme,
} from '@mantine/core'
import { IconBus } from '@tabler/icons'
import musterLogoOnly from '../../logo-only.png'

function Logo() {
  const theme = useMantineTheme()
  return (
    <>
      <span style={{ width: 50, height: 'auto' }}>
        <Image src={musterLogoOnly} />
      </span>
      <Title order={1} size="h2" color={theme.colors.brand[7]}>
        Command
      </Title>
      <Text color="dimmed" size="sm">
        Project Management
      </Text>
    </>
  )
}

export default Logo
