import { ActionIcon, Loader, Menu, Table, Title } from '@mantine/core'
import { IconDots, IconEdit, IconTrash } from '@tabler/icons'
import { Link } from 'react-router-dom'
import { useGetProjectsQuery } from '../../services/projectsEndpoints'
import ProjectEditModal from './ProjectEditModal'
import ProjectListItem from './ProjectListItem'

export default function ProjectList() {
  const { data: projects } = useGetProjectsQuery()

  if (!projects) return <Loader />

  return (
    <main>
      <Title my="md">Projects</Title>
      <Table highlightOnHover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Key</th>
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
    </main>
  )
}
