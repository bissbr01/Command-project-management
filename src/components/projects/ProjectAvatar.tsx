import { useMantineTheme } from '@mantine/core'
import BoringAvatar from 'boring-avatars'
import { Project } from '../../services/types'

export interface ProjectAvatarProps {
  project: Project
  size?: number
}

export default function ProjectAvatar({
  project,
  size = 40,
}: ProjectAvatarProps) {
  const theme = useMantineTheme()

  return (
    <BoringAvatar
      size={size}
      name={project.title}
      variant="bauhaus"
      square
      colors={[
        theme.colors.brand[4],
        theme.colors.yellow[3],
        theme.colors.indigo[5],
        theme.colors.brand[6],
        theme.colors.blue[5],
      ]}
    />
  )
}
