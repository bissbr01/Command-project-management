import { createStyles } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons'
import { Field, Form, Formik } from 'formik'
import { FocusEvent, useState } from 'react'
import * as Yup from 'yup'
import { useFocused } from '../../hooks/useFocused'
import { useUpdateIssueMutation } from '../../services/issuesEndpoints'
import { Issue } from '../../services/types'
import FieldFocusedButtons from '../common/forms/FieldFocusedButtons'
import TextAreaField from '../common/forms/TextAreaField'

const useStyles = createStyles((theme) => ({
  container: {
    margin: '1em',
    height: '100%',
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

  title: {
    fontSize: theme.fontSizes.xl,
    marginBottom: '.5em',
  },

  description: {
    fontSize: theme.fontSizes.md,
  },

  issueStatus: {
    color: theme.colors.gray[6],
    fontSize: '.8em',
    paddingTop: '.5em',
    marginTop: -50,
  },

  save: {
    alignItems: 'center',
    justifyContent: 'center',
  },
}))

interface IssueDescriptionProps {
  issue: Issue
}

export default function IssueDescription({ issue }: IssueDescriptionProps) {
  const { classes, cx } = useStyles()
  const { focused, handleFocused } = useFocused()
  const [update] = useUpdateIssueMutation()

  const TitleSchema = Yup.object().shape({
    description: Yup.string(),
  })

  return (
    <Formik
      initialValues={{
        description: issue.description,
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
        <Form>
          <Field
            stylesApi={{ input: cx(classes.description, classes.inputStyles) }}
            id="description"
            name="description"
            variant="unstyled"
            minRows="3"
            component={TextAreaField}
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
