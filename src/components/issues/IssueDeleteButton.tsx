import { Button, Group, Modal, Text, ThemeIcon, Title } from '@mantine/core'
import { IconAlertTriangle, IconExclamationMark } from '@tabler/icons'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDeleteIssueMutation } from '../../services/issuesEndpoints'

interface IssueDeleteButtonProps {
  issueId: number
}

export default function IssueDeleteButton({ issueId }: IssueDeleteButtonProps) {
  const [deleteIssue] = useDeleteIssueMutation()
  const navigate = useNavigate()
  const [opened, setOpened] = useState(false)

  const handleDelete = async () => {
    await deleteIssue(issueId)
    navigate('/')
  }
  return (
    <>
      <Group position="right" m="md">
        <Button onClick={() => setOpened(true)} color="red" variant="subtle">
          Delete
        </Button>
      </Group>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          <Title order={3}>
            <ThemeIcon color="red">
              <IconAlertTriangle />
            </ThemeIcon>{' '}
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
