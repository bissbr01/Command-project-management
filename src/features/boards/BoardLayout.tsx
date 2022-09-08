import { Button, Container, createStyles, Title } from '@mantine/core'
import NavBreadcrumbs from '../common/Breadcrumbs'
import Boards from './Boards'

const useStyles = createStyles((theme) => ({
  container: {
    flex: 1,
    alignSelf: 'flex-start',
  },
  title: {
    margin: '.5em 0',
    color: theme.colors.gray[8],
    textAlign: 'center',
    [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
      textAlign: 'left',
    },
  },
  sprintItems: {
    margin: '.5em 0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
      justifyContent: 'flex-end',
      flexDirection: 'row',
    },
  },
  sprintButton: {},
}))

export default function BoardLayout() {
  const { classes } = useStyles()
  return (
    <Container className={classes.container}>
      <NavBreadcrumbs />
      <Title className={classes.title}>Project Title</Title>
      <div className={classes.sprintItems}>
        <Button variant="default" size="sm" className={classes.sprintButton}>
          Complete Sprint
        </Button>
      </div>
      <Boards />
    </Container>
  )
}
