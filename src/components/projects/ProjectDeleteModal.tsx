import { Button, createStyles, Group, Modal, Text, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconAlertTriangle, IconX } from '@tabler/icons'
import { useDeleteProjectMutation } from '../../services/projectsEndpoints'

const useStyles = createStyles((theme) => ({
  icon: {
    color: theme.colors.red[6],
    marginRight: '1rem',
  },
}))

interface ProjectDeleteModalProps {
  projectId: number
  opened: boolean
  setOpened: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ProjectDeleteModal({
  projectId,
  opened,
  setOpened,
}: ProjectDeleteModalProps) {
  const { classes } = useStyles()
  const [deleteProject] = useDeleteProjectMutation()

  const handleDelete = async () => {
    try {
      setOpened(false)
      await deleteProject(projectId).unwrap()
    } catch (e: unknown) {
      showNotification({
        title: 'Error',
        message: 'Project could not be deleted.',
        autoClose: 4000,
        color: 'red',
        icon: <IconX />,
      })
    }
  }

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title={
        <Title order={3}>
          <IconAlertTriangle className={classes.icon} />
          Delete Project {projectId}?
        </Title>
      }
    >
      <Text component="p">
        You are about to permanently delete this project, its sprints and
        issues, and all of its data. If you are not sure, you can close this
        window instead.
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
  )
}
