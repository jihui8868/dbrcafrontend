import React from 'react'
import { useChatStore } from '../store/chat'
import { useAuthStore } from '../store/auth'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2, LogOut } from 'lucide-react'

interface SidebarProps {
  onClose?: () => void
}

export function Sidebar({ onClose }: SidebarProps) {
  const { conversations, currentConversation, createConversation, selectConversation } =
    useChatStore()
  const { logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
    onClose?.()
  }

  const handleSelectConversation = (id: string) => {
    selectConversation(id)
    onClose?.()
  }

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      {/* New Conversation Button */}
      <div className="p-4 border-b border-gray-700">
        <button
          onClick={createConversation}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition"
        >
          <Plus className="w-5 h-5" />
          <span>新建对话</span>
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {conversations.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">
            暂无对话
          </p>
        ) : (
          conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => handleSelectConversation(conversation.id)}
              className={`w-full text-left px-4 py-2 rounded-lg transition group relative ${
                currentConversation?.id === conversation.id
                  ? 'bg-gray-700'
                  : 'hover:bg-gray-800'
              }`}
              title={conversation.title || '新对话'}
            >
              <p className="text-sm truncate">
                {conversation.title || '新对话'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(conversation.created_at).toLocaleDateString('zh-CN')}
              </p>
            </button>
          ))
        )}
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-red-900 rounded-lg transition text-red-400 hover:text-red-300"
        >
          <LogOut className="w-5 h-5" />
          <span>登出</span>
        </button>
      </div>
    </div>
  )
}
