import { Issue } from '../../services/types'

export interface IssueProps {
  issue: Issue
}

export default function IssueSingle({ issue }: IssueProps) {
  return <div>{issue.title}</div>
}
