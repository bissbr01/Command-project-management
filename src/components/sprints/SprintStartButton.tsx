import { Button } from '@mantine/core'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { SprintEditModalType } from './SprintEditModal'

interface SprintStartButtonProps {
  sprintId: number
  setOpened: (value: React.SetStateAction<boolean>) => void
}

export default function SprintStartButton({
  sprintId,
  setOpened,
}: SprintStartButtonProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate({
      pathname: `sprint/${sprintId}`,
      search: createSearchParams({
        type: SprintEditModalType.START,
      }).toString(),
    })
    setOpened(false)
  }
  return (
    <Button onClick={handleClick} color="blue">
      Start Sprint
    </Button>
  )
}
