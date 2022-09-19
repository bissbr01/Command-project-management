import { Button, Container, createStyles, Loader, Title } from '@mantine/core'
import _ from 'lodash'
import { useGetIssuesByTokenQuery } from '../../services/issuesEndpoints'
import { IssueStatus } from '../../services/types'
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
  const { data: issues, isLoading } = useGetIssuesByTokenQuery()

  if (isLoading) return <Loader />

  console.log(issues)
  const columnsFromBackend: BoardColumns = {
    [IssueStatus.Todo]: {
      status: IssueStatus.Todo,
      name: 'To do',
      issues: issues?.todo ?? [],
    },
    [IssueStatus.InProgress]: {
      status: IssueStatus.InProgress,
      name: 'In Progress',
      issues: issues?.inProgress ?? [],
    },
    [IssueStatus.Done]: {
      status: IssueStatus.Done,
      name: 'Done',
      issues: issues?.done ?? [],
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
