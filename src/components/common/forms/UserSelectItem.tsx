import { Avatar, Group, Text } from '@mantine/core'
import { forwardRef } from 'react'

interface UserAssignSelectItemProps
  extends React.ComponentPropsWithoutRef<'div'> {
  value: string
  label: string
  picture: string
}

const UserAssignSelectItem = forwardRef<
  HTMLDivElement,
  UserAssignSelectItemProps
>(({ picture, label, value, ...others }: UserAssignSelectItemProps, ref) => (
  <div ref={ref} {...others}>
    <Group key={value}>
      <Avatar src={picture} alt={label} size="sm" color="blue" radius="xl">
        {label}
      </Avatar>
      <Text>{label}</Text>
    </Group>
  </div>
))

export default UserAssignSelectItem
