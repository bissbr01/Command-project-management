import { Avatar, Group, Text } from '@mantine/core'
import { forwardRef } from 'react'

interface AssignItemProps extends React.ComponentPropsWithoutRef<'div'> {
  value: string
  label: string
  avatar: string
}

const IssueAssignSelectItem = forwardRef<HTMLDivElement, AssignItemProps>(
  ({ avatar, label, value, ...others }: AssignItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group key={value}>
        <Avatar src={avatar} alt={label} size="sm" color="blue" radius="xl">
          {label}
        </Avatar>
        <Text>{label}</Text>
      </Group>
    </div>
  )
)

export default IssueAssignSelectItem
