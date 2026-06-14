export interface User {
  id: string
  username: string
  email: string
  created_at: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
}

export interface Conversation {
  id: string
  title: string | null
  created_at: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant' | 'tool'
  content: string
  created_at?: string
}

export interface ChatRequest {
  message: string
  conversation_id?: string
}

export interface ApiError {
  detail: string | Array<{ msg: string; loc: string[] }>
}
