import { Button, createStyles, Group, Modal, Text, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconAlertTriangle, IconCheck, IconX } from '@tabler/icons'
import { useRemoveColleagueMutation } from '../../services/usersEndpoints'

const useStyles = createStyles((theme) => ({
  icon: {
    color: theme.colors.red[6],
    marginRight: '1rem',
  },
}))

interface ColleagueDeleteModalProps {
  colleagueId: string
  opened: boolean
  setOpened: React.Dispatch<React.SetStateAction<boolean>>
}

export default function ColleagueDeleteModal({
  colleagueId,
  opened,
  setOpened,
}: ColleagueDeleteModalProps) {
  const { classes } = useStyles()
  const [removeColleague] = useRemoveColleagueMutation()

  const handleDelete = async () => {
    try {
      setOpened(false)
      await removeColleague({ id: colleagueId }).unwrap()
      showNotification({
        title: 'Success',
        message: 'Colleague Removed',
        autoClose: 4000,
        color: 'green',
        icon: <IconCheck />,
      })
    } catch (e: unknown) {
      showNotification({
        title: 'Error',
        message: 'Colleague could not be Removed.',
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
          Remove Colleague?
        </Title>
      }
    >
      <Text component="p">
        You are about to remove this colleague from your network. If you are not
        sure, you can close this window instead.
      </Text>
      <Group position="right">
        <Button onClick={handleDelete} color="red">
          Remove
        </Button>
        <Button onClick={() => setOpened(false)} variant="default">
          Cancel
        </Button>
      </Group>
    </Modal>
  )
}
