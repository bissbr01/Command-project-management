import {
  Button,
  createStyles,
  Group,
  Modal,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core'
import { IconAlertTriangle, IconExclamationMark } from '@tabler/icons'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDeleteIssueMutation } from '../../services/issuesEndpoints'

const useStyles = createStyles((theme) => ({
  icon: {
    color: theme.colors.red[6],
    marginRight: '1rem',
  },
}))

interface IssueDeleteButtonProps {
  issueId: number
}

export default function IssueDeleteButton({ issueId }: IssueDeleteButtonProps) {
  const [deleteIssue] = useDeleteIssueMutation()
  const navigate = useNavigate()
  const { classes } = useStyles()
  const [opened, setOpened] = useState(false)

  const handleDelete = async () => {
    await deleteIssue(issueId)
    navigate('/')
  }
  return (
    <>
      <Group position="right" m="md">
        <Button
          onClick={() => setOpened(true)}
          color="red"
          variant="subtle"
          size="sm"
          radius="xl"
        >
          Delete Issue
        </Button>
      </Group>

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
    </>
  )
}
