import { forwardRef } from 'react'
import { IconChevronRight } from '@tabler/icons'
import { Group, Avatar, Text, UnstyledButton } from '@mantine/core'
import { User } from '../../services/types'

interface UserButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  user: User
}

const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(
  ({ user, ...others }: UserButtonProps, ref) => (
    <UnstyledButton
      ref={ref}
      sx={(theme) => ({
        display: 'block',
        width: '100%',
        padding: theme.spacing.md,
        color:
          theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

        '&:hover': {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
      {...others}
    >
      <Group>
        <Avatar
          src={null}
          alt={user.fullName}
          size="md"
          color="blue"
          radius="xl"
        >
          {user.firstName[0] + user.lastName[0]}
        </Avatar>

        <div style={{ flex: 1 }}>
          <Text size="sm" weight={500}>
            {user.fullName}
          </Text>

          <Text color="dimmed" size="xs">
            {user.email}
          </Text>
        </div>

        <IconChevronRight size={16} />
      </Group>
    </UnstyledButton>
  )
)

export default UserButton
