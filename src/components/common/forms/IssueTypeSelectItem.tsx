import { forwardRef } from 'react'
import { Group, Text } from '@mantine/core'

interface IssueTypeSelecItemProps
  extends React.ComponentPropsWithoutRef<'div'> {
  icon: JSX.Element
  label: string
}

const IssueTypeSelectItem = forwardRef<HTMLDivElement, IssueTypeSelecItemProps>(
  ({ icon, label, ...others }: IssueTypeSelecItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        {icon}
        <div>
          <Text size="sm">{label}</Text>
        </div>
      </Group>
    </div>
  )
)

export default IssueTypeSelectItem
