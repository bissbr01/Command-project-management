import { Autocomplete, createStyles } from '@mantine/core'
import { IconSearch } from '@tabler/icons'

const useStyles = createStyles((theme) => ({
  search: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },
}))

function NavSearch() {
  const { classes } = useStyles()

  return (
    <Autocomplete
      className={classes.search}
      placeholder="Search"
      icon={<IconSearch size={16} stroke={1.5} />}
      data={[
        'React',
        'Angular',
        'Vue',
        'Next.js',
        'Riot.js',
        'Svelte',
        'Blitz.js',
      ]}
    />
  )
}

export default NavSearch
