import { Button } from '@mantine/core'

interface ProjectCreateButtonProps {
  setOpened: (value: React.SetStateAction<boolean>) => void
}

export default function ProjectCreateButton({
  setOpened,
}: ProjectCreateButtonProps) {
  return (
    <Button onClick={() => setOpened(true)} color="blue">
      Create Project
    </Button>
  )
}
