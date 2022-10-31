import {
  Avatar,
  createStyles,
  Group,
  Text,
  useMantineTheme,
} from '@mantine/core'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useDeleteCommentMutation } from '../../services/commentsEndpoints'
import { Comment } from '../../services/types'
import { useGetUserByTokenQuery } from '../../services/usersEndpoints'
import DotMenu from '../common/DotMenu'
import LoadingCircle from '../common/LoadingCircle'
import DeleteModal from '../common/modals/DeleteModal'
import CommentEditModal from './CommentEditModal'

const useStyles = createStyles((theme) => ({
  comment: {
    marginTop: '1em',
    flexBasis: 1,
  },

  body: {
    paddingLeft: 54,
  },

  icon: {
    color: theme.colors.red[6],
    marginRight: '1rem',
  },
}))

interface CommentListItemProps {
  comment: Comment
}

export default function CommentListItem({ comment }: CommentListItemProps) {
  const { classes } = useStyles()
  const theme = useMantineTheme()
  const [deleteOpened, setDeleteOpened] = useState(false)
  const [editOpened, setEditOpened] = useState(false)
  const [deleteComment] = useDeleteCommentMutation()
  const { data: me } = useGetUserByTokenQuery()

  const timeCreated = () => {
    const date = dayjs(comment.createdAt).format('h:ma MMM D, YYYY')
    return date
  }

  if (!me) return <LoadingCircle />

  return (
    <>
      <article className={classes.comment}>
        <Group>
          <Avatar
            src={comment.author?.picture}
            color={theme.colors.brand[1]}
            radius="xl"
          />
          <Text size="sm" color="dimmed">
            {comment.author?.nickname}
          </Text>
          <Text size="xs" color="dimmed">
            {timeCreated()}
          </Text>
          {comment.authorId === me.id && (
            <DotMenu
              setEditOpened={setEditOpened}
              setDeleteOpened={setDeleteOpened}
            />
          )}
        </Group>
        <div className={classes.body}>
          <Text size="sm" mr="3rem">
            {comment.text}
          </Text>
        </div>
      </article>
      <CommentEditModal
        comment={comment}
        opened={editOpened}
        setOpened={setEditOpened}
      />
      <DeleteModal
        item={comment}
        deleteMutation={deleteComment}
        opened={deleteOpened}
        setOpened={setDeleteOpened}
      />
    </>
  )
}
