import { Group, Text, Title } from '@mantine/core'
import { useState } from 'react'
import { User } from '../../services/types'
import ColleagueAddCard from './ColleagueAddCard'
import ColleagueAddModal from './ColleagueAddModal'
import UserListItem from './UserListItem'

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

  return (
    <section>
      <Title order={2}>Colleagues</Title>
      <Group>
        <ColleagueAddCard setOpened={setAddOpened} seed={seed} />
        <UserListItem user={me} />
        {colleagues &&
          colleagues.map((colleague) => (
            <UserListItem user={colleague} key={colleague.id} />
          ))}
      </Group>
      <ColleagueAddModal opened={addOpened} setOpened={setAddOpened} />
    </section>
  )
}
