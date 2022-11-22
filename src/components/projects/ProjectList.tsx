import {
  Box,
  createStyles,
  Group,
  Loader,
  Table,
  Title,
  useMantineTheme,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { useState } from 'react'
import { useGetProjectsQuery } from '../../services/projectsEndpoints'
import LoadingCircle from '../common/LoadingCircle'
import ProjectCreateButton from './ProjectCreateButton'
import ProjectCreateModal from './ProjectCreateModal'
import ProjectListItem from './ProjectListItem'

const useStyles = createStyles((theme) => ({
  createButton: {
    margin: '0 1rem 0 auto',
  },
}))

export default function ProjectList() {
  const { data: projects } = useGetProjectsQuery()
  const [createOpened, setCreateOpened] = useState(false)
  const { classes } = useStyles()
  const theme = useMantineTheme()
  const minScreenSmall = useMediaQuery(`(min-width: ${theme.breakpoints.sm}px)`)

  if (!projects) return <LoadingCircle />

  return (
    <main>
      <Group>
        <Title my="md">Projects</Title>
        <Box className={classes.createButton}>
          <ProjectCreateButton setOpened={setCreateOpened} />
        </Box>
      </Group>
      <Table highlightOnHover>
        <thead>
          <tr>
            <th>Name</th>
            {minScreenSmall && <th>Sprints</th>}
            <th>Team</th>
            {minScreenSmall && <th>Lead</th>}
            <th> </th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <ProjectListItem project={project} key={project.id} />
          ))}
        </tbody>
      </Table>
      <ProjectCreateModal opened={createOpened} setOpened={setCreateOpened} />
    </main>
  )
}
