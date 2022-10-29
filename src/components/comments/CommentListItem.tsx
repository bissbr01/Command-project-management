import {
  Avatar,
  Button,
  createStyles,
  Group,
  Loader,
  Modal,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core'
import { IconAlertTriangle } from '@tabler/icons'
import dayjs from 'dayjs'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDeleteCommentMutation } from '../../services/commentsEndpoints'
import { Comment } from '../../services/types'
import { useGetUserByTokenQuery } from '../../services/usersEndpoints'
import DotMenu from '../common/DotMenu'
import DeleteModal from '../common/modals/DeleteModal'
import CommentMenu from './CommentMenu'

const useStyles = createStyles((theme) => ({
  comment: {
    marginTop: '1em',
    flexBasis: 1,
  },

  body: {
    paddingLeft: 54,
    // paddingTop: '.25rem',
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

  if (!me) return <Loader />

  return (
    <>
      <article className={classes.comment}>
        <Group>
          <Avatar
            src={comment.author?.picture}
            color={theme.colors.brand[1]}
            radius="xl"
          />
          <Text size="sm">{comment.author?.nickname}</Text>
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
          <Text size="sm" mr="3rem" pl="1rem">
            {comment.text}
          </Text>
        </div>
      </article>
      <DeleteModal
        item={comment}
        deleteMutation={deleteComment}
        opened={deleteOpened}
        setOpened={setDeleteOpened}
      />
    </>
  )
}
