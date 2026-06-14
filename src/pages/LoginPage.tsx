import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth'
import { AlertCircle } from 'lucide-react'

export function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const { isLoading, error, login, register } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isLogin) {
        await login(username, password)
      } else {
        if (password !== confirmPassword) {
          alert('Passwords do not match')
          return
        }
        await register(username, email, password)
      }
      navigate('/chat')
    } catch (error) {
      // Error is handled by store
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">DBRCA Chat</h1>
          <p className="text-gray-600">智能对话助手</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">
            {isLogin ? '登录' : '注册'}
          </h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                用户名
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="输入用户名"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  邮箱
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="输入邮箱"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="输入密码"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  确认密码
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="再次输入密码"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  required={!isLogin}
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white font-medium py-2 rounded-lg hover:bg-opacity-90 disabled:opacity-50 transition"
          >
            {isLoading ? '处理中...' : isLogin ? '登录' : '注册'}
          </button>

          <div className="mt-4 text-center">
            <p className="text-gray-600 text-sm">
              {isLogin ? '没有账户？' : '已有账户？'}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setUsername('')
                  setEmail('')
                  setPassword('')
                  setConfirmPassword('')
                }}
                className="text-primary font-medium hover:underline ml-1"
              >
                {isLogin ? '注册' : '登录'}
              </button>
            </p>
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700 font-medium">测试账户</p>
          <p className="text-sm text-blue-600 mt-1">用户名: swaggertest</p>
          <p className="text-sm text-blue-600">密码: test123456</p>
        </div>
      </div>
    </div>
  )
}
