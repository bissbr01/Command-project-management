import { createStyles, Group, Text, Title } from '@mantine/core'
import { useState } from 'react'
import { User } from '../../services/types'
import ColleagueAddCard from './ColleagueAddCard'
import ColleagueAddModal from './ColleagueAddModal'
import UserListItem from './UserListItem'

const useStyles = createStyles((theme) => ({
  group: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    gap: '1rem',
    [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
  },
}))

interface ColleagueListProps {
  colleagues: User[] | undefined
  me: User
  seed: number
}

export default function ColleagueList({
  colleagues,
  me,
  seed,
}: ColleagueListProps) {
  const [addOpened, setAddOpened] = useState(false)
  const { classes } = useStyles()

  return (
    <section>
      <Title order={2} py="md">
        Colleagues
      </Title>
      <div className={classes.group}>
        <ColleagueAddCard setOpened={setAddOpened} seed={seed} />
        <UserListItem user={me} />
        {colleagues &&
          colleagues.map((colleague) => (
            <UserListItem user={colleague} key={colleague.id} />
          ))}
      </div>
      <ColleagueAddModal opened={addOpened} setOpened={setAddOpened} />
    </section>
  )
}
