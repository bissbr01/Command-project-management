import { Button, createStyles, Loader, Text, Title } from '@mantine/core'
import { listenerCancelled } from '@reduxjs/toolkit/dist/listenerMiddleware/exceptions'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useGetSprintForBoardQuery } from '../../services/sprintsEndpoints'
import SprintCompletedButton from '../sprints/SprintCompletedButton'
import SprintCompletedModal from '../sprints/SprintCompletedModal'
import Board from './Board'

const useStyles = createStyles((theme) => ({
  container: {
    flex: 1,
    alignSelf: 'flex-start',
  },
  title: {
    margin: '.5em 0',
    color: theme.colors.gray[8],
    justifySelf: 'flex-start',
    alignSelf: 'flex-start',

    [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
      textAlign: 'left',
    },
  },
  sprintItems: {
    margin: '.5em 0',
    display: 'flex',
    flex: '0 1 content',
    flexDirection: 'column',
    alignItems: 'center',
    [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
      flexDirection: 'row',
    },
  },
  rightGroup: {
    marginLeft: 'auto',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
}))

export default function BoardLayout() {
  const { classes } = useStyles()
  const { data: { sprint, boardColumns } = {}, isLoading } =
    useGetSprintForBoardQuery()
  const [opened, setOpened] = useState(false)

  if (isLoading || !sprint || !boardColumns) return <Loader />

  return (
    <main>
      <div className={classes.sprintItems}>
        <Title className={classes.title} order={1} size="h2">
          Sprint {sprint?.id}
        </Title>
        <div className={classes.rightGroup}>
          {sprint?.endOn && (
            <Text color="dimmed" mr={20}>
              {dayjs(sprint.endOn).diff(dayjs(), 'days')} days remaining
            </Text>
          )}
          <SprintCompletedButton sprintId={sprint.id} setOpened={setOpened} />
        </div>
      </div>
      <Board />
      <SprintCompletedModal opened={opened} setOpened={setOpened} />
    </main>
  )
}
