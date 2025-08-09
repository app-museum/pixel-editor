"use client"

import { memo } from 'react'
import { usePixelEditorStore } from '@/lib/stores/pixel-editor-store'
import type { Tool } from '@/lib/stores/pixel-editor-store'

interface ToolButtonProps {
  tool: Tool
  icon: string
  label: string
  isActive: boolean
  onClick: () => void
}

const ToolButton = memo<ToolButtonProps>(({ icon, label, isActive, onClick }) => (
  <button
    className={`px-2 py-2 sm:px-3 sm:py-3 rounded-lg font-medium transition-all duration-200 text-sm ${
      isActive
        ? "bg-blue-500 text-white shadow-lg transform scale-105" 
        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }`}
    onClick={onClick}
    aria-pressed={isActive}
  >
    {icon} {label}
  </button>
))

ToolButton.displayName = 'ToolButton'

export const ToolPalette = memo(() => {
  const { selectedTool, setSelectedTool } = usePixelEditorStore()

  const tools: Array<{ tool: Tool; icon: string; label: string }> = [
    { tool: 'pen', icon: '🖊️', label: 'ペン' },
    { tool: 'eraser', icon: '🧹', label: '消しゴム' },
    { tool: 'fill', icon: '🪣', label: '塗りつぶし' }
  ]

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">ツール</h3>
      <div className="grid grid-cols-3 gap-2">
        {tools.map(({ tool, icon, label }) => (
          <ToolButton
            key={tool}
            tool={tool}
            icon={icon}
            label={label}
            isActive={selectedTool === tool}
            onClick={() => setSelectedTool(tool)}
          />
        ))}
      </div>
    </div>
  )
})

ToolPalette.displayName = 'ToolPalette'