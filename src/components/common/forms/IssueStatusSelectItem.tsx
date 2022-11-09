import { forwardRef } from 'react'
import IssueStatusDisplay from '../../issues/IssueStatusDisplay'
import { IssueStatus } from '../../../services/types'

interface IssueStatusSelectItemProps
  extends React.ComponentPropsWithoutRef<'div'> {
  value: IssueStatus
  label: string
}

const IssueStatusSelectItem = forwardRef<
  HTMLDivElement,
  IssueStatusSelectItemProps
>(({ value, label, ...others }: IssueStatusSelectItemProps, ref) => (
  <div ref={ref} {...others}>
    <IssueStatusDisplay status={value} />
  </div>
))

export default IssueStatusSelectItem
