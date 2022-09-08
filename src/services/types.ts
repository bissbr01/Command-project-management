export interface Comment {
  id: number
  text: string
  author: User
  issue: Issue
}

export interface Issue {
  id: number
  status: 'backlog' | 'todo' | 'inProgress' | 'done'
  attachmentUri?: string
  description?: string
  title?: string
  type: 'userStory' | 'bug' | 'task'
  assignee?: User
  author: User
  sprint: Sprint
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
  email: string
  password?: string
  admin?: boolean
  disabled?: boolean
}
