export interface Comment {
  id: number
  text: string
  author: User
  issue: Issue
}

export enum IssueStatus {
  Backlog = 'backlog',
  Todo = 'todo',
  InProgress = 'inProgress',
  Done = 'done',
}

export enum IssueType {
  UserStory = 'userStory',
  Bug = 'bug',
  Task = 'task',
}

export interface Issue {
  id: number
  status: IssueStatus
  attachmentUri?: string
  description?: string
  title?: string
  type: IssueType
  assignee?: User
  author?: User
  sprint?: Sprint
}

export interface Sprint {
  id: number
  goal: string
  startOn?: Date
  length?: number
  project: Project
  author: User
}

export interface Project {
  id: number
  title: string
  author: User
}

export interface User {
  id: number
  firstName: string
  lastName: string
  fullName: string
  email: string
  createdAt: string
  updatedAt: string
  password?: string
  admin?: boolean
  disabled?: boolean
  projects?: Project[]
  sprints?: Sprint[]
  authoredIssues?: Issue[]
  assignedIssues?: Issue[]
}

export interface Token {
  token: string
}

export interface Credentials {
  email: string
  password: string
}

export function assertUnreachable(x: never): never {
  throw new Error('Exhaustive switch reached default condition!')
}
