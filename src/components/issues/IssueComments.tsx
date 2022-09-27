import {
  Autocomplete,
  Avatar,
  createStyles,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core'
import { IconUserCircle } from '@tabler/icons'
import { Comment } from '../../services/types'

const useStyles = createStyles((theme) => ({
  container: {
    marginBottom: '1em',
    display: 'flex',
    flexDirection: 'column',
    rowGap: 10,
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

interface IssueCommentsProps {
  comments: Comment[]
}

export default function IssueComments({ comments }: IssueCommentsProps) {
  const { classes } = useStyles()

  return (
    <>
      <Title size="h5">Comments</Title>
      <section className={classes.container}>
        {comments.map((comment) => (
          <article key={comment.id} className={classes.comment}>
            <Group>
              <IconUserCircle size={14} />
              <div>
                <Text size="sm">{comment.author?.fullName}</Text>
                <Text size="xs" color="dimmed">
                  {new Date(comment.createdAt).toLocaleTimeString('en-US')}
                </Text>
              </div>
            </Group>
            <Text className={classes.body} size="sm">
              {comment.text}
            </Text>
          </article>
        ))}
      </section>
    </>
  )
}
