import {
  CloseButton,
  createStyles,
  Group,
  LoadingOverlay,
  Paper,
  ScrollArea,
  Text,
} from '@mantine/core'
import { useState } from 'react'
import {
  useDeleteIssueMutation,
  useGetIssueByIdQuery,
} from '../../services/issuesEndpoints'
import CommentsList from '../comments/CommentsList'
import IssueTitle from './IssueTitle'
import IssueDescription from './IssueDescription'
import IssueTypeForm from './IssueTypeForm'
import IssueStoryPoints from './IssueStoryPoints'
import DotMenu from '../common/DotMenu'
import DeleteModal from '../common/modals/DeleteModal'
import IssueAssignForm from './IssueAssignForm'
import LoadingCircle from '../common/LoadingCircle'
import IssueStatusForm from './IssueStatusForm'

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
  },

  save: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  header: {
    color: theme.colors.gray[6],
    fontSize: '.8em',
    paddingTop: '.5em',
    height: '5vh',
  },

  scroll: {
    height: '97vh',
  },
}))

export interface IssueSingleProps {
  issueId: string
  onClose: () => void
}

export default function IssueSingle({ issueId, onClose }: IssueSingleProps) {
  const { classes } = useStyles()
  const { data: issue } = useGetIssueByIdQuery(issueId)
  const [deleteOpened, setDeleteOpened] = useState(false)
  const [deleteIssue] = useDeleteIssueMutation()

  if (!issue) return <LoadingCircle />

  return (
    <>
      <ScrollArea offsetScrollbars className={classes.scroll}>
        <Paper className={classes.container} m="0 0 0 .5rem" p="0 1rem">
          <Group className={classes.header} noWrap>
            <IssueStatusForm issue={issue} />
            <IssueTypeForm issue={issue} />
            <Text>{issue.name}</Text>
            <DotMenu setDeleteOpened={setDeleteOpened} setClosed={onClose} />
            {/* <CloseButton onClick={onClose} /> */}
          </Group>
          <IssueTitle issue={issue} />
          <IssueDescription issue={issue} />
          <Group align="flex-start" noWrap>
            <IssueStoryPoints issue={issue} />
            <IssueAssignForm issue={issue} />
          </Group>
          <CommentsList issueId={issue.id} />
        </Paper>
      </ScrollArea>
      <DeleteModal
        item={issue}
        deleteMutation={deleteIssue}
        opened={deleteOpened}
        setOpened={setDeleteOpened}
        beforeSubmit={onClose}
        prompt="You are about to permanently delete this issue, its comments and
        attachments, and all of its data. If you are not sure, you can close
        this issue instead."
      />
    </>
  )
}
