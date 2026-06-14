import axios, { AxiosInstance } from 'axios'
import { User, AuthResponse, Conversation, Message } from '../types'

class ApiClient {
  private client: AxiosInstance
  private token: string | null = null

  constructor() {
    this.client = axios.create({
      baseURL: 'http://localhost:8000',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.token = localStorage.getItem('access_token')
    this.updateAuthHeader()

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.clearAuth()
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  private updateAuthHeader() {
    if (this.token) {
      this.client.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
    } else {
      delete this.client.defaults.headers.common['Authorization']
    }
  }

  setToken(token: string) {
    this.token = token
    localStorage.setItem('access_token', token)
    this.updateAuthHeader()
  }

  clearAuth() {
    this.token = null
    localStorage.removeItem('access_token')
    this.updateAuthHeader()
  }

  // Auth endpoints
  async register(username: string, email: string, password: string): Promise<User> {
    const response = await this.client.post<User>('/auth/register', {
      username,
      email,
      password,
    })
    return response.data
  }

  async login(username: string, password: string): Promise<AuthResponse> {
    const formData = new FormData()
    formData.append('username', username)
    formData.append('password', password)

    const response = await this.client.post<AuthResponse>('/auth/login', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.client.get<User>('/auth/me')
    return response.data
  }

  // Chat endpoints
  async listConversations(): Promise<Conversation[]> {
    const response = await this.client.get<Conversation[]>('/chat/sessions')
    return response.data
  }

  async createConversation(): Promise<Conversation> {
    const response = await this.client.post<Conversation>('/chat/sessions')
    return response.data
  }

  async getMessages(conversationId: string): Promise<any[]> {
    const response = await this.client.get<any[]>(`/chat/${conversationId}/messages`)
    return response.data
  }

  async sendMessage(conversationId: string, message: string): Promise<ReadableStreamDefaultReader<Uint8Array>> {
    const token = this.token
    const response = await fetch(
      `http://localhost:8000/chat/${conversationId}/message`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ message }),
      }
    )

    if (!response.ok) {
      if (response.status === 401) {
        this.clearAuth()
        window.location.href = '/login'
      }
      throw new Error(`HTTP ${response.status}`)
    }

    if (!response.body) {
      throw new Error('No response body')
    }
    return response.body.getReader()
  }
}

export const apiClient = new ApiClient()
