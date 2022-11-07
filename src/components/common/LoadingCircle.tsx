import { createStyles, Loader } from '@mantine/core'

const useStyles = createStyles((theme) => ({
  container: {
    display: 'box',
    justifyContent: 'center',
    alignContent: 'center',
    height: '100vh',
    width: '100vw',
  },

  loader: {
    color: theme.colors.brand[4],
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  },
}))

export default function LoadingCircle() {
  const { classes } = useStyles()
  return (
    <div className={classes.container}>
      <Loader className={classes.loader} />
    </div>
  )
}
