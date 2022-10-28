import { createStyles, Loader, ScrollArea, Title } from '@mantine/core'
import { useGetCommentsByIssueQuery } from '../../services/commentsEndpoints'
import AddComment from './AddComment'
import ListComment from './ListComment'

const useStyles = createStyles(() => ({
  container: {
    // marginTop: '2rem',
    // display: 'flex',
    // flexDirection: 'column',
    // rowGap: 10,
    height: '50vh',
    // overflowY: 'scroll',
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
    <section>
      <Title order={3} size="h5" mb="xs" mt="md">
        Comments
      </Title>
      <ScrollArea className={classes.container}>
        <AddComment issueId={issueId} />
        {comments.map((comment) => (
          <ListComment key={comment.id} comment={comment} />
        ))}
      </ScrollArea>
    </section>
  )
}
