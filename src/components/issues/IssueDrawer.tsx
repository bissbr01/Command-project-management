import { Drawer, useMantineTheme } from '@mantine/core'
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
  const { id } = useParams()
  const navigate = useNavigate()
  const theme = useMantineTheme()

  const handleClose = () => {
    setIssueOpened(false)
    navigate(-1)
  }

  return (
    <Drawer
      position="right"
      opened={issueOpened}
      onClose={handleClose}
      padding="md"
      size="xl"
      overlayOpacity={0.2}
      overlayColor={
        theme.colorScheme === 'dark' ? theme.colors.dark[9] : 'white'
      }
    >
      {id && <IssueSingle issueId={id} onClose={handleClose} />}
    </Drawer>
  )
}
