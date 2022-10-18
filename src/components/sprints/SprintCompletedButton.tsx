import { Button } from '@mantine/core'
import { useNavigate } from 'react-router-dom'

interface SprintCompletedButtonProps {
  sprintId: number
  setOpened: (value: React.SetStateAction<boolean>) => void
}

export default function SprintCompletedButton({
  sprintId,
  setOpened,
}: SprintCompletedButtonProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`sprint/${sprintId}`)
    setOpened(true)
  }

  return (
    <Button variant="default" size="sm" onClick={handleClick}>
      Complete Sprint
    </Button>
  )
}
