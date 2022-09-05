import {
  Anchor,
  Breadcrumbs,
  Button,
  Container,
  createStyles,
  Paper,
  Text,
  Title,
} from '@mantine/core'
import DragDropList from './DragDropList'

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
    background: theme.colors.gray[0],
    padding: '1em',
  },
}))

function BoardLayout() {
  const { classes } = useStyles()
  const items = [
    { title: 'Mantine', href: '#' },
    { title: 'Mantine hooks', href: '#' },
    { title: 'use-id', href: '#' },
  ].map((item) => (
    <Anchor href={item.href} key={item.title}>
      {item.title}
    </Anchor>
  ))

  const data = [
    {
      position: 6,
      mass: 12.011,
      symbol: 'C',
      name: 'Carbon',
    },
    {
      position: 7,
      mass: 14.007,
      symbol: 'N',
      name: 'Nitrogen',
    },
    {
      position: 39,
      mass: 88.906,
      symbol: 'Y',
      name: 'Yttrium',
    },
    {
      position: 56,
      mass: 137.33,
      symbol: 'Ba',
      name: 'Barium',
    },
    {
      position: 58,
      mass: 140.12,
      symbol: 'Ce',
      name: 'Cerium',
    },
  ]
  return (
    <main className={classes.container}>
      <Container>
        <Breadcrumbs>{items}</Breadcrumbs>
        <Title>Project Title</Title>
        <Button variant="default">Complete Sprint</Button>
        <section className={classes.boards}>
          <div className={classes.board}>
            <Paper shadow="sm" p="lg">
              <DragDropList data={data} />
            </Paper>
          </div>
          <div className={classes.board}>
            <Paper shadow="sm" p="lg">
              <Text>Paper is the most basic ui component</Text>
              <Text>
                Use it to create cards, dropdowns, modals and other components
                that require background with shadow
              </Text>
            </Paper>
          </div>
          <div className={classes.board}>
            <Paper shadow="sm" p="lg">
              <Text>Paper is the most basic ui component</Text>
              <Text>
                Use it to create cards, dropdowns, modals and other components
                that require background with shadow
              </Text>
            </Paper>
          </div>
        </section>
      </Container>
    </main>
  )
}

export default BoardLayout
