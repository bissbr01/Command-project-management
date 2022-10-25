import { Avatar, Button, Card, createStyles, Space, Stack } from '@mantine/core'
import { buildAvatarString } from '../../services/util'

const useStyles = createStyles((theme) => ({
  card: {
    width: theme.other.cardWidth,
    height: theme.other.cardHeight,
  },
}))

interface ColleagueAddCardProps {
  setOpened: React.Dispatch<React.SetStateAction<boolean>>
  seed: number
}

export default function ColleagueAddCard({
  setOpened,
  seed,
}: ColleagueAddCardProps) {
  const { classes } = useStyles()

  return (
    <Card withBorder shadow="sm" radius="md" className={classes.card}>
      <Stack align="center">
        <Avatar
          src={buildAvatarString(seed)}
          alt="default image"
          size="lg"
          color="blue"
          radius="xl"
        >
          Invite Colleague
        </Avatar>
        <Space />
        <Button onClick={() => setOpened(true)}>Invite Colleague</Button>
      </Stack>
    </Card>
  )
}
