import { Group, ThemeIcon } from '@mantine/core'
import { IconBus } from '@tabler/icons'

function Logo() {
  return (
    <Group>
      <ThemeIcon variant="filled">
        <IconBus size={28} />
      </ThemeIcon>
      Scrum Bus
    </Group>
  )
}

export default Logo
