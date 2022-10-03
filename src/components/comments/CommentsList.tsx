import { createStyles, Loader, Title } from '@mantine/core'
import {
  useGetCommentsByIssueQuery,
  useGetCommentsQuery,
} from '../../services/commentsEndpoints'
import { Issue } from '../../services/types'
import AddComment from './AddComment'
import ListComment from './ListComment'

const useStyles = createStyles(() => ({
  container: {
    margin: '1em 0',
    display: 'flex',
    flexDirection: 'column',
    rowGap: 10,
    height: '50vh',
    overflowY: 'scroll',
  },
}))

interface CommentsListProps {
  issueId: number
}

export default function CommentsList({ issueId }: CommentsListProps) {
  const { classes } = useStyles()
  const { data: comments, isLoading } = useGetCommentsByIssueQuery(issueId)

  if (isLoading || !comments) return <Loader />

  return (
    <>
      <Title order={3} size="h5">
        Comments
      </Title>
      <section className={classes.container}>
        <AddComment issueId={issueId} />
        {comments.map((comment) => (
          <ListComment key={comment.id} comment={comment} />
        ))}
      </section>
    </>
  )
}
