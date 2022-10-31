import { createStyles, Loader, ScrollArea, Title } from '@mantine/core'
import { useGetCommentsByIssueQuery } from '../../services/commentsEndpoints'
import LoadingCircle from '../common/LoadingCircle'
import AddComment from './AddComment'
import CommentListItem from './CommentListItem'

const useStyles = createStyles(() => ({
  container: {
    // marginTop: '2rem',
    // display: 'flex',
    // flexDirection: 'column',
    // rowGap: 10,
    // height: '47vh',
    // overflowY: 'scroll',
  },
}))

interface CommentsListProps {
  issueId: number
}

export default function CommentsList({ issueId }: CommentsListProps) {
  const { classes } = useStyles()
  const { data: comments, isLoading } = useGetCommentsByIssueQuery(issueId)

  if (isLoading || !comments) return <LoadingCircle />

  return (
    <section>
      <Title order={3} size="h5" mb="xs" mt="md">
        Comments
      </Title>
      <AddComment issueId={issueId} />
      {comments.map((comment) => (
        <CommentListItem key={comment.id} comment={comment} />
      ))}
    </section>
  )
}
