import { createStyles, Loader, Text, Title } from '@mantine/core'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGetSprintForBoardQuery } from '../../services/sprintsEndpoints'
import LoadingCircle from '../common/LoadingCircle'
import SprintCompletedButton from '../sprints/SprintCompletedButton'
import SprintCompletedModal from '../sprints/SprintCompletedModal'
import SprintEditModal from '../sprints/SprintEditModal'
import SprintStartButton from '../sprints/SprintStartButton'
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
  const { projectId } = useParams()
  const { classes } = useStyles()
  const {
    data: { sprint, boardColumns } = {},
    isLoading,
    isError,
  } = useGetSprintForBoardQuery({ projectId })
  const [completedOpened, setCompletedOpened] = useState(false)
  const [startOpened, setStartOpened] = useState(false)

  if (isLoading) return <LoadingCircle />

  if (isError || !sprint || !boardColumns)
    return (
      <main>
        <Text>
          There are currently no active sprints to display. Go to the Backlog
          and start or edit a sprint to see it here.
        </Text>
      </main>
    )

  const formatEndOn = () => {
    const daysLeft = Math.ceil(dayjs(sprint.endOn).diff(dayjs(), 'day', true))
    let formatString = `${daysLeft} `
    formatString += daysLeft === 1 ? 'day ' : 'days '
    formatString += 'remaining'
    return formatString
  }

  return (
    <main>
      <div className={classes.sprintItems}>
        <Title className={classes.title} order={1} size="h2">
          {sprint.name}
        </Title>
        <div className={classes.rightGroup}>
          {sprint?.endOn && (
            <Text color="dimmed" mr={20}>
              {formatEndOn()}
            </Text>
          )}
          {sprint.startOn ? (
            <SprintCompletedButton
              sprintId={sprint.id}
              setOpened={setCompletedOpened}
            />
          ) : (
            <SprintStartButton
              sprintId={sprint.id}
              setOpened={setStartOpened}
            />
          )}
        </div>
      </div>
      <Board />
      <SprintCompletedModal
        opened={completedOpened}
        setOpened={setCompletedOpened}
      />
      <SprintEditModal opened={startOpened} setOpened={setStartOpened} />
    </main>
  )
}
