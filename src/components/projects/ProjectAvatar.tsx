import { useMantineTheme } from '@mantine/core'
import BoringAvatar from 'boring-avatars'
import { Project } from '../../services/types'

interface ProjectAvatarProps {
  project: Project
}

export default function ProjectAvatar({ project }: ProjectAvatarProps) {
  const theme = useMantineTheme()

  return (
    <BoringAvatar
      size={40}
      name={project.title}
      variant="bauhaus"
      square
      colors={[
        theme.colors.red[6],
        theme.colors.brand[4],
        theme.colors.indigo[5],
        theme.colors.yellow[6],
        theme.colors.blue[4],
      ]}
    />
  )
}
