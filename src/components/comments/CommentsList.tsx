import { createStyles, Loader, ScrollArea, Title } from '@mantine/core'
import { useGetCommentsByIssueQuery } from '../../services/commentsEndpoints'
import LoadingCircle from '../common/LoadingCircle'
import AddComment from './AddComment'
import CommentListItem from './CommentListItem'

interface CommentsListProps {
  issueId: number
}

export default function CommentsList({ issueId }: CommentsListProps) {
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
