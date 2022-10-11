import { createStyles, Title } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons'
import { Field, Form, Formik } from 'formik'
import { FocusEvent } from 'react'
import * as Yup from 'yup'
import { useFocused } from '../../hooks/useFocused'
import { useUpdateIssueMutation } from '../../services/issuesEndpoints'
import { Issue } from '../../services/types'
import FieldFocusedButtons from '../common/forms/FieldFocusedButtons'
import NumberField from '../common/forms/NumberField'

const useStyles = createStyles((theme) => ({
  container: {
    marginBottom: '1rem',
  },

  form: {},

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

interface IssueStoryPointsProps {
  issue: Issue
}

export default function IssueStoryPoints({ issue }: IssueStoryPointsProps) {
  const { classes, cx } = useStyles()
  const { focused, handleFocused } = useFocused()
  const [update] = useUpdateIssueMutation()

  const TitleSchema = Yup.object().shape({
    storyPoints: Yup.number(),
  })

  return (
    <Formik
      initialValues={{
        storyPoints: issue.storyPoints ?? 0,
      }}
      validationSchema={TitleSchema}
      onSubmit={async (values) => {
        try {
          await update({ id: issue.id, ...values })
          showNotification({
            title: 'Success',
            message: 'Issue successfully saved.',
            autoClose: 4000,
            color: 'green',
            icon: <IconCheck />,
          })
          handleFocused(false)
        } catch (e: unknown) {
          showNotification({
            title: 'Error',
            message: 'Issue could not be updated.',
            autoClose: 4000,
            color: 'red',
            icon: <IconX />,
          })
          if (e instanceof Error) {
            console.log(e.message)
          }
        }
      }}
    >
      {({ isSubmitting, handleBlur }) => (
        <Form className={classes.container}>
          <Field
            stylesApi={{ input: cx(classes.inputStyles) }}
            id="storyPoints"
            name="storyPoints"
            // variant="unstyled"
            label={
              <Title order={3} size="h5">
                Story Points
              </Title>
            }
            component={NumberField}
            onFocus={() => handleFocused(true)}
            onBlur={(e: FocusEvent) => {
              handleBlur(e)
              // if not clicking a form button, unfocus
              if (
                !(e.relatedTarget?.id === 'save') &&
                !(e.relatedTarget?.id === 'reset')
              ) {
                handleFocused(false)
              }
            }}
          />
          {focused && (
            <FieldFocusedButtons
              isSubmitting={isSubmitting}
              handleFocused={handleFocused}
            />
          )}
        </Form>
      )}
    </Formik>
  )
}
