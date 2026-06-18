import { Menu } from 'lucide-react'
import { useSidebar } from '@/contexts/SidebarContext'

interface PageHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  const { toggle } = useSidebar()

  return (
    <div className="flex items-start justify-between border-b border-gray-200 bg-white px-4 py-4 sm:px-6">
      <div className="flex items-start gap-3">
        <button
          onClick={toggle}
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          {description && <p className="mt-0.5 text-sm text-gray-500">{description}</p>}
        </div>
      </div>
      {action && <div className="ml-4 shrink-0">{action}</div>}
    </div>
  )
}
