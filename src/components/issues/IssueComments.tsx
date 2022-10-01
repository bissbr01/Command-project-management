import {
  Accordion,
  Autocomplete,
  Avatar,
  createStyles,
  Group,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core'
import { IconUserCircle } from '@tabler/icons'
import { Comment, Issue } from '../../services/types'
import AddComment from './AddComment'

const useStyles = createStyles((theme) => ({
  container: {
    margin: '1em 0',
    display: 'flex',
    flexDirection: 'column',
    rowGap: 10,
    height: '50vh',
    overflowY: 'scroll',
  },

  comment: {
    marginTop: '1em',
    flexBasis: 1,
  },

  body: {
    paddingLeft: 54,
    paddingTop: '.25rem',
  },
}))

interface ListCommentProps {
  comment: Comment
}

function ListComment({ comment }: ListCommentProps) {
  const { classes } = useStyles()
  const theme = useMantineTheme()

  const created = () => {
    const date = new Date(comment.createdAt)
    let createdString = date.toLocaleTimeString('en-US')
    createdString += ' '
    createdString += date.toLocaleDateString('en-US')
    return createdString
  }

  return (
    <article key={comment.id} className={classes.comment}>
      <Group>
        <Avatar color={theme.colors.brand[1]} radius="xl" />
        <div>
          <Text size="sm">{comment.author?.fullName}</Text>
          <Text size="xs" color="dimmed">
            {created()}
          </Text>
        </div>
      </Group>
      <Text className={classes.body} size="sm">
        {comment.text}
      </Text>
    </article>
  )
}

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
