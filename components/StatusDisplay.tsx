"use client"

import { memo } from 'react'
import { usePixelEditorStore } from '@/lib/stores/pixel-editor-store'

const getToolLabel = (tool: string) => {
  switch (tool) {
    case 'pen': return 'ペン'
    case 'eraser': return '消しゴム' 
    case 'fill': return '塗りつぶし'
    default: return tool
  }
}

export const StatusDisplay = memo(() => {
  const { selectedTool, selectedColor, canvasSize } = usePixelEditorStore()

  return (
    <div className="mt-4 flex flex-wrap justify-center gap-2">
      <div className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
        現在のツール: {getToolLabel(selectedTool)}
      </div>
      <div className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
        キャンバスサイズ: {canvasSize}×{canvasSize}
      </div>
      {selectedTool === "pen" && (
        <div className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded flex items-center gap-1">
          選択色: 
          <div 
            className="w-4 h-4 rounded border border-gray-300"
            style={{ backgroundColor: selectedColor }}
          />
        </div>
      )}
    </div>
  )
})

StatusDisplay.displayName = 'StatusDisplay'