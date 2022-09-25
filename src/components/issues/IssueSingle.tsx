import { Loader } from '@mantine/core'
import { useParams } from 'react-router-dom'
import { useGetIssueByIdQuery } from '../../services/issuesEndpoints'
import { Issue } from '../../services/types'

export interface IssueSingleProps {
  issue: Issue
}

export default function IssueSingle({ issue }: IssueSingleProps) {
  // const params = useParams()
  // const { data: issue, isLoading } = useGetIssueByIdQuery(params.id as string)

  // if (isLoading) return <Loader />
  // if (!issue) return <div>error: no issue</div>

  return <div>{issue.title}</div>
}
