import { Drawer } from '@mantine/core'
import { SetStateAction } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import IssueSingle from './IssueSingle'

export interface IssueDrawerProps {
  issueOpened: boolean
  setIssueOpened: React.Dispatch<SetStateAction<boolean>>
}

export default function IssueDrawer({
  issueOpened,
  setIssueOpened,
}: IssueDrawerProps) {
  const navigate = useNavigate()
  const { id } = useParams()

  const handleClose = () => {
    setIssueOpened(false)
    navigate('/')
  }

  return (
    <Drawer
      position="right"
      opened={issueOpened}
      onClose={handleClose}
      padding="xl"
      size="xl"
    >
      {id && <IssueSingle issueId={id} />}
    </Drawer>
  )
}
