import { Paper, createStyles, Button, Title, Text, Anchor } from '@mantine/core'
import { Formik, Form, Field } from 'formik'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import YupPassword from 'yup-password'
import { setToken } from '../../reducers/authentication'
import { useLoginMutation } from '../../services/loginEndpoints'
import PasswordField from '../common/forms/PasswordField'
import TextField from '../common/forms/TextField'

YupPassword(Yup) // extend yup

const useStyles = createStyles((theme) => ({
  wrapper: {
    minHeight: 900,
    backgroundSize: 'cover',
    backgroundImage:
      'url(https://images.unsplash.com/photo-1484242857719-4b9144542727?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1280&q=80)',
  },

  form: {
    borderRight: `1px solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
    }`,
    minHeight: 900,
    maxWidth: 450,
    paddingTop: 80,

    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: '100%',
    },
  },

  title: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },

  logo: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    width: 120,
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}))

const LoginSchema = Yup.object().shape({
  firstName: Yup.string().required('Required'),
  lastName: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().password().required('Required'),
})

export default function Login() {
  const { classes } = useStyles()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [login, { data, isSuccess, isError, error }] = useLoginMutation()
  return (
    <div className={classes.wrapper}>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={async (values) => {
          await login(values)
          if (isSuccess && data) {
            dispatch(setToken(data))
          }
          if (isError) console.log(error)
          navigate('/')
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Paper className={classes.form} radius={0} p={30}>
              <Title
                order={2}
                className={classes.title}
                align="center"
                mt="md"
                mb={50}
              >
                Welcome to Scrum Bus
              </Title>
              <Field
                id="email"
                name="email"
                label="Email address"
                placeholder="hello@gmail.com"
                component={TextField}
              />
              <Field
                id="password"
                name="password"
                label="Password"
                placeholder="Your password"
                mt="md"
                size="md"
                component={PasswordField}
              />
              <Button
                type="submit"
                fullWidth
                mt="xl"
                size="md"
                disabled={isSubmitting}
              >
                Login
              </Button>

              <Text align="center" mt="md">
                Don&apos;t have an account?{' '}
                <Anchor<'a'>
                  href="#"
                  weight={700}
                  onClick={(event) => event.preventDefault()}
                >
                  Register
                </Anchor>
              </Text>
            </Paper>
          </Form>
        )}
      </Formik>
    </div>
  )
}
