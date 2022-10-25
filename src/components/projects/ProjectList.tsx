import { Box, createStyles, Group, Loader, Table, Title } from '@mantine/core'
import { useState } from 'react'
import { useGetProjectsQuery } from '../../services/projectsEndpoints'
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

  if (!projects) return <Loader />

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
            <th>Sprints</th>
            <th>Team</th>
            <th>Lead</th>
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
