import { createStyles, Title } from '@mantine/core'
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

interface IssueCommentsProps {
  issue: Issue
}

export default function IssueComments({ issue }: IssueCommentsProps) {
  const { classes } = useStyles()

  return (
    <>
      <Title order={3} size="h5">
        Comments
      </Title>
      <section className={classes.container}>
        <AddComment issueId={issue.id} />
        {issue.comments.map((comment) => (
          <ListComment key={comment.id} comment={comment} />
        ))}
      </section>
    </>
  )
}
