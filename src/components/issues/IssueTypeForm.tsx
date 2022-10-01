import { createStyles, Group, Text } from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { IconCheck, IconX } from '@tabler/icons'
import { Field, Form, Formik } from 'formik'
import { useState } from 'react'
import * as Yup from 'yup'
import { useFocused } from '../../hooks/useFocused'
import { useUpdateIssueMutation } from '../../services/issuesEndpoints'
import { Issue } from '../../services/types'
import FieldFocusedButtons from '../common/forms/FieldFocusedButtons'
import IssueTypeSelectField from '../common/forms/IssueTypeSelectField'
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

interface IssueTypeFormProps {
  issue: Issue
}

export default function IssueTypeForm({ issue }: IssueTypeFormProps) {
  const { classes } = useStyles()

  const IssueTypeFormSchema = Yup.object().shape({
    type: Yup.string(),
  })

  return (
    <Formik
      initialValues={{
        type: issue.type,
      }}
      validationSchema={IssueTypeFormSchema}
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
      {({ isSubmitting, submitForm }) => (
        <Form>
          <Group className={classes.issueStatus}>
            <Field
              id="type"
              name="type"
              value="type"
              variant="unstyled"
              component={IssueTypeSelectField}
            />
            <Text>Issue {issue.id}</Text>
          </Group>
        </Form>
      )}
    </Formik>
  )
}
