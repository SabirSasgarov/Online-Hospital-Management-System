import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext'

function Layout() {
  const { isOpen, close } = useSidebar()
  const location = useLocation()

  useEffect(() => {
    close()
  }, [location.pathname])

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={close}
        />
      )}

      {/* Sidebar — off-canvas on mobile, always visible on desktop */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 transition-transform duration-300 lg:static lg:translate-x-0 lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <Sidebar />
      </div>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}

export function AppLayout() {
  return (
    <SidebarProvider>
      <Layout />
    </SidebarProvider>
  )
}
