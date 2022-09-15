import { Button, Container, createStyles, Title } from '@mantine/core'
import { useGetIssuesQuery } from '../../services/issuesEndpoints'
import { Issue, IssueStatus } from '../../services/types'
import NavBreadcrumbs from '../common/Breadcrumbs'
import Boards, { BoardColumns } from './Boards'

const useStyles = createStyles((theme) => ({
  container: {
    flex: 1,
    alignSelf: 'flex-start',
  },
  title: {
    margin: '.5em 0',
    color: theme.colors.gray[8],
    textAlign: 'center',
    [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
      textAlign: 'left',
    },
  },
  sprintItems: {
    margin: '.5em 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
      justifyContent: 'flex-end',
      flexDirection: 'row',
    },
  },
  sprintButton: {},
}))

export default function BoardLayout() {
  const { classes } = useStyles()
  const { isLoading, data } = useGetIssuesQuery()

  if (isLoading) return <div>loading</div>
  if (!data) return <div>Issues failed to load</div>

  const columnsFromBackend: BoardColumns = {
    [IssueStatus.Todo]: {
      status: IssueStatus.Todo,
      name: 'To do',
      items: data,
    },
    [IssueStatus.InProgress]: {
      status: IssueStatus.InProgress,
      name: 'In Progress',
      items: [],
    },
    [IssueStatus.Done]: {
      status: IssueStatus.Done,
      name: 'Done',
      items: [],
    },
  }
  return (
    <Container className={classes.container}>
      <NavBreadcrumbs />
      <Title className={classes.title}>Project Title</Title>
      <div className={classes.sprintItems}>
        <Button variant="default" size="sm" className={classes.sprintButton}>
          Complete Sprint
        </Button>
      </div>
      <Boards boardColumns={columnsFromBackend} />
    </Container>
  )
}
