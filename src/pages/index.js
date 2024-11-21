import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import FocusTools from '../components/FocusTools'

// 动态导入悬浮窗组件
const FloatingWindow = dynamic(() => import('../components/FloatingWindow'), {
  ssr: false
})

export default function Home() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto p-4">
        <FocusTools />
      </div>
      <div className="fixed bottom-4 right-4 text-sm text-gray-500">
        Tips: 可拖动顶部移动位置
      </div>
    </main>
  )
}