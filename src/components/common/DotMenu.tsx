import { ActionIcon, Menu } from '@mantine/core'
import { IconDots, IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons'

interface DotMenuProps {
  setEditOpened: React.Dispatch<React.SetStateAction<boolean>>
  setDeleteOpened: React.Dispatch<React.SetStateAction<boolean>>
}

export default function DotMenu({
  setEditOpened,
  setDeleteOpened,
}: DotMenuProps) {
  return (
    <Menu withinPortal position="right-end" shadow="sm">
      <Menu.Target>
        <ActionIcon>
          <IconDotsVertical />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          onClick={() => setEditOpened(true)}
          icon={<IconEdit size={16} />}
        >
          Edit
        </Menu.Item>
        <Menu.Item
          onClick={() => setDeleteOpened(true)}
          color="red"
          icon={<IconTrash size={16} />}
        >
          Delete
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
