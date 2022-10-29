import { ActionIcon, Menu } from '@mantine/core'
import { IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons'

export interface DotMenuProps {
  setEditOpened?: React.Dispatch<React.SetStateAction<boolean>>
  setDeleteOpened: React.Dispatch<React.SetStateAction<boolean>>
  margin?: string
}

export default function DotMenu({
  setEditOpened,
  setDeleteOpened,
  margin = '0 0 0 auto',
}: DotMenuProps) {
  return (
    <Menu withinPortal position="bottom-end" shadow="sm">
      <Menu.Target>
        <ActionIcon sx={{ margin }}>
          <IconDotsVertical size={18} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown>
        {setEditOpened && (
          <Menu.Item
            onClick={() => setEditOpened(true)}
            icon={<IconEdit size={16} />}
          >
            Edit
          </Menu.Item>
        )}
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
