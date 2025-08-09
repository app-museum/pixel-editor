"use client"

import { memo } from 'react'
import { usePixelEditorStore } from '@/lib/stores/pixel-editor-store'

interface SizeButtonProps {
  size: number
  isActive: boolean
  onClick: () => void
}

const SizeButton = memo<SizeButtonProps>(({ size, isActive, onClick }) => (
  <button
    className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${
      isActive
        ? "bg-green-500 text-white shadow-lg"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }`}
    onClick={onClick}
  >
    {size}×{size}
  </button>
))

SizeButton.displayName = 'SizeButton'

export const CanvasSizeSelector = memo(() => {
  const { canvasSize, setCanvasSize } = usePixelEditorStore()

  const sizes = [16, 32, 64]

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">キャンバスサイズ</h3>
      <div className="grid grid-cols-3 gap-2">
        {sizes.map((size) => (
          <SizeButton
            key={size}
            size={size}
            isActive={canvasSize === size}
            onClick={() => setCanvasSize(size)}
          />
        ))}
      </div>
    </div>
  )
})

CanvasSizeSelector.displayName = 'CanvasSizeSelector'