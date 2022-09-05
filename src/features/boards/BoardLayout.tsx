import { Container, createStyles, SimpleGrid, Title } from '@mantine/core'

const useStyles = createStyles((theme) => ({
  container: {
    flex: 1,
    alignSelf: 'flex-start',
  },
  boards: {
    display: 'flex',
    flexDirection: 'column',
    [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
      flexDirection: 'row',
    },
  },
  board: {
    flex: 1,
  },
}))

function BoardLayout() {
  const { classes } = useStyles()

  return (
    <main className={classes.container}>
      <Container>
        <span>breadcrumbs</span>
        <Title>Project Title</Title>
        <button type="button">complete sprint</button>
        <section className={classes.boards}>
          <div className={classes.board}>Todo</div>
          <div className={classes.board}>In Progress</div>
          <div className={classes.board}>Done</div>
        </section>
      </Container>
    </main>
  )
}

export default BoardLayout
