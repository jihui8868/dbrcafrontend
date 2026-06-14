import React, { useState, useRef } from 'react'
import { useChatStore } from '../store/chat'
import { Send, Plus } from 'lucide-react'

interface ChatInputProps {
  disabled?: boolean
  onComposing?: (composing: boolean) => void
}

export function ChatInput({ disabled = false, onComposing }: ChatInputProps) {
  const [input, setInput] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { sendMessage, isSending } = useChatStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || isSending || disabled) return

    let messageContent = input

    // Add file information to message if files are uploaded
    if (uploadedFiles.length > 0) {
      const fileInfo = uploadedFiles
        .map((f) => `[File: ${f.name} (${f.type})]`)
        .join('\n')
      messageContent = `${fileInfo}\n\n${input}`
    }

    await sendMessage(messageContent)
    setInput('')
    setUploadedFiles([])

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setUploadedFiles((prev) => [...prev, ...files])
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target
    setInput(textarea.value)

    // Auto-resize textarea
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px'
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="border-t border-gray-200 bg-white p-4 md:p-6">
      {uploadedFiles.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="bg-gray-100 rounded-lg px-3 py-2 text-sm flex items-center justify-between gap-2 max-w-xs"
            >
              <span className="truncate">{file.name}</span>
              <button
                onClick={() => removeFile(index)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-4">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isSending}
          className="p-2 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
          title="上传文件"
        >
          <Plus className="w-6 h-6 text-gray-600" />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || isSending}
        />

        <div className="flex-1 flex gap-4">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="输入消息... (Shift+Enter 换行，Enter 发送)"
            disabled={disabled || isSending}
            className="flex-1 bg-gray-100 text-gray-900 placeholder-gray-500 rounded-lg px-4 py-3 outline-none focus:bg-white focus:border border-transparent focus:border-primary resize-none max-h-48"
            rows={1}
          />

          <button
            type="submit"
            disabled={disabled || isSending || !input.trim()}
            className="p-2 hover:bg-primary hover:text-white rounded-lg transition disabled:opacity-50 disabled:hover:bg-transparent"
            title="发送消息"
          >
            <Send className="w-6 h-6 text-gray-600 hover:text-primary" />
          </button>
        </div>
      </form>

      <p className="text-xs text-gray-400 mt-2">
        提示: 支持 Markdown 格式、图片、表格等。可上传文件供 AI 参考。
      </p>
    </div>
  )
}
