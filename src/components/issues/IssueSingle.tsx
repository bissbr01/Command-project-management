import { createStyles, LoadingOverlay, Paper } from '@mantine/core'
import { useGetIssueByIdQuery } from '../../services/issuesEndpoints'
import CommentsList from '../comments/CommentsList'
import IssueTitle from './IssueTitle'
import IssueDescription from './IssueDescription'
import IssueTypeForm from './IssueTypeForm'
import IssueDeleteButton from './IssueDeleteButton'

const useStyles = createStyles((theme) => ({
  container: {
    margin: '1em',
    height: '100%',
  },

  form: {},

  inputStyles: {
    padding: 10,
    '&:hover': {
      backgroundColor: theme.colors.gray[1],
    },
    '&:focus': {
      border: `2px solid ${theme.colors.brand[1]}`,
      borderRadius: 5,
      '&:hover': {
        backgroundColor: theme.white,
      },
    },
  },

  title: {
    fontSize: theme.fontSizes.xl,
    marginBottom: '.5em',
  },

  description: {
    fontSize: theme.fontSizes.md,
  },

  issueStatus: {
    color: theme.colors.gray[6],
    fontSize: '.8em',
    paddingTop: '.5em',
    marginTop: -50,
  },

  save: {
    alignItems: 'center',
    justifyContent: 'center',
  },
}))

export interface IssueSingleProps {
  issueId: string
}

export default function IssueSingle({ issueId }: IssueSingleProps) {
  const { classes } = useStyles()
  const { data: issue, isLoading } = useGetIssueByIdQuery(issueId)

  if (isLoading) return <LoadingOverlay visible={isLoading} />
  if (!issue) return <div>error: no issue</div>

  return (
    <Paper className={classes.container}>
      <IssueTypeForm issue={issue} />
      <IssueTitle issue={issue} />
      <IssueDescription issue={issue} />
      <CommentsList issueId={issue.id} />
      <IssueDeleteButton issueId={issue.id} />
    </Paper>
  )
}
