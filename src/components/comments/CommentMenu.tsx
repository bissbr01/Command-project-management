import { ActionIcon, createStyles, Menu } from '@mantine/core'
import { IconDots, IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons'

const useStyles = createStyles((theme) => ({
  container: {
    marginLeft: 'auto',
    marginRight: '2rem',
  },
}))

interface CommentMenuProps {
  handleDelete: React.Dispatch<React.SetStateAction<boolean>>
  handleEdit: React.Dispatch<React.SetStateAction<boolean>> | undefined
}

export default function CommentMenu({
  handleDelete,
  handleEdit,
}: CommentMenuProps) {
  const { classes } = useStyles()
  return (
    <nav className={classes.container}>
      <Menu width={200} position="bottom-end">
        <Menu.Target>
          <ActionIcon size="sm">
            <IconDotsVertical />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          {handleEdit && (
            <Menu.Item
              // color="red"
              icon={<IconEdit size={16} />}
              onClick={() => handleEdit(true)}
            >
              Edit
            </Menu.Item>
          )}
          <Menu.Item
            color="red"
            icon={<IconTrash size={16} />}
            onClick={() => handleDelete(true)}
          >
            Delete
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </nav>
  )
}
