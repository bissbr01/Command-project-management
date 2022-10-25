import { Avatar, Button, Card, Stack } from '@mantine/core'
import { buildAvatarString } from '../../services/util'

interface ColleagueAddCardProps {
  setOpened: React.Dispatch<React.SetStateAction<boolean>>
  seed: number
}

export default function ColleagueAddCard({
  setOpened,
  seed,
}: ColleagueAddCardProps) {
  return (
    <Card withBorder shadow="sm" radius="md">
      <Stack align="center">
        <Avatar
          src={buildAvatarString(seed)}
          alt="default image"
          size="lg"
          color="blue"
          radius="xl"
        >
          Add Colleague
        </Avatar>
        <Button onClick={() => setOpened(true)}>Add Colleague</Button>
      </Stack>
    </Card>
  )
}
