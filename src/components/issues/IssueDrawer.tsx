import { Drawer, Loader } from '@mantine/core'
import { useParams } from 'react-router-dom'
import { useGetIssueByIdQuery } from '../../services/issuesEndpoints'
import { Issue } from '../../services/types'
import IssueSingle from './IssueSingle'

export interface IssueDrawerProps {
  opened: boolean
  setOpened: React.Dispatch<React.SetStateAction<boolean>>
  issue: Issue
}

export default function IssueDrawer({
  opened,
  setOpened,
  issue,
}: IssueDrawerProps) {
  const params = useParams()
  if (!params.id || typeof params.id !== 'string')
    return <div>error: no id</div>
  return (
    <Drawer
      position="right"
      opened={opened}
      onClose={() => setOpened(false)}
      padding="xl"
      size="xl"
    >
      <IssueSingle issue={issue} />
    </Drawer>
  )
}
