import { Button, createStyles, Group, Modal, Text, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconAlertTriangle, IconX } from '@tabler/icons'
import { useDeleteProjectMutation } from '../../services/projectsEndpoints'
import { useDeleteTeamMutation } from '../../services/teamsEndpoints'

const useStyles = createStyles((theme) => ({
  icon: {
    color: theme.colors.red[6],
    marginRight: '1rem',
  },
}))

interface TeamDeleteModalProps {
  teamId: number
  opened: boolean
  setOpened: React.Dispatch<React.SetStateAction<boolean>>
}

export default function TeamDeleteModal({
  teamId,
  opened,
  setOpened,
}: TeamDeleteModalProps) {
  const { classes } = useStyles()
  const [deleteTeam] = useDeleteTeamMutation()

  const handleDelete = async () => {
    try {
      setOpened(false)
      await deleteTeam(teamId).unwrap()
    } catch (e: unknown) {
      showNotification({
        title: 'Error',
        message: 'Team could not be deleted.',
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
          Delete Team?
        </Title>
      }
    >
      <Text component="p">
        You are about to permanently delete this team. If you are not sure, you
        can close this window instead.
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
