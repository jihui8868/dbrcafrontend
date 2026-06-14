import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth'
import { useChatStore } from '../store/chat'
import { Sidebar } from '../components/Sidebar'
import { ChatWindow } from '../components/ChatWindow'
import { Menu } from 'lucide-react'
import { useState } from 'react'

export function ChatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, isAuthenticated } = useAuthStore()
  const { fetchConversations } = useChatStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    fetchConversations()
  }, [isAuthenticated, navigate, fetchConversations])

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">加载中...</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-white">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 hover:bg-gray-200 rounded"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-900 text-white transform transition-transform lg:relative lg:translate-x-0 z-30 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <ChatWindow />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
