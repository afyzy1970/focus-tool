import dynamic from 'next/dynamic'
import FocusTools from '../components/FocusTools'

// 动态导入悬浮窗组件，避免服务端渲染问题
const FloatingWindow = dynamic(() => import('../components/FloatingWindow'), {
  ssr: false
})

export default function Home() {
  return (
    <main>
      <FloatingWindow>
        <FocusTools />
      </FloatingWindow>
    </main>
  )
}