import { createStyles, Title, Modal, Button, Text, Group } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { useUpdateCommentMutation } from '../../services/commentsEndpoints'
import { Comment } from '../../services/types'
import TextField from '../common/forms/TextField'

const useStyles = createStyles((theme) => ({
  container: {
    marginBottom: '1rem',
    '& .mantine-InputWrapper-root': {
      marginBottom: '1rem',
    },
  },

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

  save: {
    alignItems: 'center',
    justifyContent: 'center',
  },
}))

export interface CommentEditModalProps {
  comment: Comment
  opened: boolean
  setOpened: React.Dispatch<React.SetStateAction<boolean>>
}

export default function CommentEditModal({
  comment,
  opened,
  setOpened,
}: CommentEditModalProps) {
  const [updateComment] = useUpdateCommentMutation()
  const { classes, cx } = useStyles()

  const TeamUpdateModalSchema = Yup.object().shape({
    text: Yup.string(),
  })

  return (
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title={<Title order={2}>Update Comment</Title>}
    >
      <Formik
        initialValues={{
          text: comment.text,
        }}
        validationSchema={TeamUpdateModalSchema}
        onSubmit={async ({ text }) => {
          try {
            setOpened(false)
            await updateComment({
              id: comment.id,
              text,
            }).unwrap()
            showNotification({
              title: 'Success',
              message: 'Comment successfully saved.',
              autoClose: 4000,
              color: 'green',
              icon: <IconCheck />,
            })
          } catch (e: unknown) {
            showNotification({
              title: 'Error',
              message: 'Comment could not be updated.',
              autoClose: 4000,
              color: 'red',
              icon: <IconX />,
            })
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className={classes.container}>
            <Field
              stylesApi={{ input: cx(classes.inputStyles) }}
              id="text"
              name="text"
              label={<Text>Message</Text>}
              component={TextField}
            />
            <Group position="center">
              <Button type="submit" disabled={isSubmitting}>
                Update
              </Button>
              <Button
                onClick={() => setOpened(false)}
                disabled={isSubmitting}
                variant="default"
              >
                Cancel
              </Button>
            </Group>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}
