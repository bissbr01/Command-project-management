import { Drawer } from '@mantine/core'

export interface IssueDrawerProps {
  opened: boolean
  setOpened: React.Dispatch<React.SetStateAction<boolean>>
}

export default function IssueDrawer({ opened, setOpened }: IssueDrawerProps) {
  return (
    <Drawer
      opened={opened}
      onClose={() => setOpened(false)}
      title="Register"
      padding="xl"
      size="xl"
    >
      This will be an issue to edit
    </Drawer>
  )
}
