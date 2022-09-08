import { Anchor, Breadcrumbs, createStyles } from '@mantine/core'

const useStyles = createStyles((theme) => ({
  breadcrumbs: {
    margin: '.5em 0',
  },
}))

function NavBreadcrumbs() {
  const { classes } = useStyles()
  const breadCrumbLinks = [
    { title: 'Mantine', href: '#' },
    { title: 'Mantine hooks', href: '#' },
    { title: 'use-id', href: '#' },
  ].map((item) => (
    <Anchor href={item.href} key={item.title}>
      {item.title}
    </Anchor>
  ))
  return (
    <Breadcrumbs className={classes.breadcrumbs}>{breadCrumbLinks}</Breadcrumbs>
  )
}

export default NavBreadcrumbs
