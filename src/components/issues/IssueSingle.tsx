import { LoadingOverlay } from '@mantine/core'
import { useParams } from 'react-router-dom'
import { useGetIssueByIdQuery } from '../../services/issuesEndpoints'
import { Issue } from '../../services/types'

export interface IssueSingleProps {
  issueId: string
}

export default function IssueSingle({ issueId }: IssueSingleProps) {
  const { data: issue, isLoading } = useGetIssueByIdQuery(issueId)

  if (isLoading) return <LoadingOverlay visible={isLoading} />
  if (!issue) return <div>error: no issue</div>

  return <div>{issue.title}</div>
}
