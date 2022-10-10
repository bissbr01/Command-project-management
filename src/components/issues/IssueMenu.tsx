import {
  ActionIcon,
  Button,
  createStyles,
  Group,
  Menu,
  Modal,
  Text,
  Title,
} from '@mantine/core'
import {
  IconAlertTriangle,
  IconDotsVertical,
  IconEdit,
  IconTrash,
} from '@tabler/icons'
import { useState } from 'react'
import { useDeleteIssueMutation } from '../../services/issuesEndpoints'

const useStyles = createStyles((theme) => ({
  container: {
    marginLeft: 'auto',
    marginRight: '2rem',
  },

  icon: {
    color: theme.colors.red[6],
    marginRight: '1rem',
  },
}))

interface IssueMenuProps {
  issueId: number
  onClose: () => void
}

export default function IssueMenu({ issueId, onClose }: IssueMenuProps) {
  const { classes } = useStyles()
  const [deleteIssue] = useDeleteIssueMutation()
  const [opened, setOpened] = useState(false)

  const handleDelete = async () => {
    onClose()
    await deleteIssue(issueId)
    setOpened(false)
  }

  return (
    <nav className={classes.container}>
      <Menu width={200} position="bottom-end">
        <Menu.Target>
          <ActionIcon size="sm">
            <IconDotsVertical />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            onClick={() => setOpened(true)}
            color="red"
            icon={<IconTrash size={16} />}
          >
            Delete
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          <Title order={3}>
            <IconAlertTriangle className={classes.icon} />
            Delete Issue {issueId}?
          </Title>
        }
      >
        <Text component="p">
          You are about to permanently delete this issue, its comments and
          attachments, and all of its data. If you are not sure, you can close
          this issue instead.
        </Text>
        <Group position="right">
          <Button onClick={handleDelete} color="red">
            Delete
          </Button>
          <Button onClick={() => setOpened(false)} variant="default">
            Cancel
          </Button>
        </Group>
      </Modal>
    </nav>
  )
}
