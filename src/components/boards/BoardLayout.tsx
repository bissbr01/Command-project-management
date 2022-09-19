import { Button, Container, createStyles, Title } from '@mantine/core'
import _ from 'lodash'
import { useGetIssuesQuery } from '../../services/issuesEndpoints'
import { Issue, IssueStatus } from '../../services/types'
import { useGetUserByTokenQuery } from '../../services/usersEndpoints'
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
  const { data: user, isLoading } = useGetUserByTokenQuery()

  if (isLoading) return <div>loading</div>
  // if (!user) return <div>Issues failed to load</div>

  const issues = _.groupBy(user?.authoredIssues, 'status')

  console.log(issues)

  const columnsFromBackend: BoardColumns = {
    [IssueStatus.Todo]: {
      status: IssueStatus.Todo,
      name: 'To do',
      items: issues.todo,
    },
    [IssueStatus.InProgress]: {
      status: IssueStatus.InProgress,
      name: 'In Progress',
      items: issues.inProgress ?? [],
    },
    [IssueStatus.Done]: {
      status: IssueStatus.Done,
      name: 'Done',
      items: issues.done ?? [],
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
